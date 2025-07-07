"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

interface Voie {
  id: number;
  nom?: string;
  cotation?: string;
  ouvreur?: string;
  type_de_voie?: string;
  description?: string;
}

interface VoieSeanceForm {
  voie_id: number | "";
  reussie: boolean;
  avis: string;
}

// Fonction pour la couleur de cotation (copiée de la page salle)
function getDifficultyColor(difficulte: string): string {
  const colors: { [key: string]: string } = {
    '3a': '#00ff00',
    '3b': '#00ff00',
    '3c': '#00ff00',
    '4a': '#ffff00',
    '4b': '#ffff00',
    '4c': '#ffff00',
    '5a': '#ff8000',
    '5b': '#ff8000',
    '5c': '#ff8000',
    '6a': '#ff0000',
    '6b': '#ff0000',
    '6c': '#ff0000',
    '7a': '#800080',
    '7b': '#800080',
    '7c': '#800080',
    '8a': '#000000',
    '8b': '#000000',
    '8c': '#000000',
  };
  const base = difficulte?.toLowerCase().replace('+', '');
  return colors[base] || '#666';
}

// Fonction pour générer un fond pâle à partir d'une couleur hex
function paleBgColor(hex: string) {
  // Si noir, on fait un gris pâle
  if (hex === '#000000') return '#f0f0f0';
  // Convertit le hex en RGB et blend avec blanc (80% blanc)
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},0.12)`;
}

export default function SeanceNouvellePage() {
  const router = useRouter();
  const params = useParams();
  const salle_id = params.id as string;
  const { userInfo } = useAuth();

  // Date du jour ISO (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);
  const [avisSeance, setAvisSeance] = useState("");
  const [voies, setVoies] = useState<VoieSeanceForm[]>([
    { voie_id: "", reussie: false, avis: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listeVoies, setListeVoies] = useState<Voie[]>([]);
  const [selectedVoieIdx, setSelectedVoieIdx] = useState<number | null>(null);
  const [salleNom, setSalleNom] = useState<string>("");

  useEffect(() => {
    // Récupérer la liste des voies de la salle
    const fetchVoies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/salles/${salle_id}/voies`
        );
        const data = await res.json();
        if (data.success && data.data && data.data.voies) {
          setListeVoies(data.data.voies);
        }
      } catch (e) {}
    };
    fetchVoies();
    // Récupérer le nom de la salle
    const fetchSalle = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/salles/${salle_id}`
        );
        const data = await res.json();
        if (data.success && data.data && data.data.nom) {
          setSalleNom(data.data.nom);
        }
      } catch (e) {}
    };
    fetchSalle();
  }, [salle_id]);

  const handleVoieChange = (
    index: number,
    field: keyof VoieSeanceForm,
    value: any
  ) => {
    setVoies((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addVoie = () => {
    setVoies((prev) => [...prev, { voie_id: "", reussie: false, avis: "" }]);
  };

  const removeVoie = (index: number) => {
    setVoies((prev) => prev.filter((_, i) => i !== index));
    if (selectedVoieIdx === index) setSelectedVoieIdx(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Créer la séance
      const seanceRes = await fetch(
        `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/seances`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            user_id: userInfo?.userId, 
            date: today, 
            avis: avisSeance,
            salle_id: parseInt(salle_id)
          }),
        }
      );
      const seanceData = await seanceRes.json();
      if (!seanceRes.ok)
        throw new Error(seanceData.error || "Erreur création séance");
      const seance_id = seanceData.data.id;

      // 2. Créer les voies associées
      const voieSeances = voies.map((v) => ({
        seance_id,
        voie_id: Number(v.voie_id),
        reussie: v.reussie,
        avis: v.avis,
      }));
      const voiesRes = await fetch(
        `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/voie-seances/batch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voieSeances }),
        }
      );
      const voiesData = await voiesRes.json();
      if (!voiesRes.ok)
        throw new Error(voiesData.error || "Erreur création voies");

      router.push(`/salles/${salle_id}` as any);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalRoutes = voies.length;
  const successfulRoutes = voies.filter((v) => v.reussie).length;

  // Aperçu voie sélectionnée
  const selectedVoie =
    selectedVoieIdx !== null && voies[selectedVoieIdx]?.voie_id
      ? listeVoies.find((v) => v.id === Number(voies[selectedVoieIdx].voie_id))
      : null;

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "2rem 0",
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#2c3e50" }}>
          Nouvelle séance dans la salle {salleNom || salle_id}
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "1.1rem" }}>
          Enregistrez votre session d'escalade du {today.split("-").reverse().join("/")}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Formulaire scrollable */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "2.5rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            height: "70vh",
            overflowY: "auto",
            minHeight: 400,
            maxHeight: "80vh",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "#2c3e50",
                  marginBottom: "1.5rem",
                  paddingBottom: ".5rem",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                📅 Informations de la séance
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      color: "#2c3e50",
                      marginBottom: ".5rem",
                    }}
                  >
                    Date de la séance
                  </label>
                  <input
                    type="text"
                    value={today.split("-").reverse().join("/")}
                    disabled
                    style={{
                      width: "100%",
                      padding: "1rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: "1rem",
                      background: "#f8f9fa",
                      color: "#888",
                    }}
                  />
                </div>
                <div></div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: "#2c3e50",
                    marginBottom: ".5rem",
                  }}
                >
                  Avis sur la séance
                </label>
                <textarea
                  value={avisSeance}
                  onChange={(e) => setAvisSeance(e.target.value)}
                  placeholder="Comment s'est passée votre séance ? Ressenti général, points à améliorer..."
                  style={{
                    width: "100%",
                    padding: "1rem",
                    border: "2px solid #e0e0e0",
                    borderRadius: 8,
                    fontSize: "1rem",
                    minHeight: 100,
                    background: "#f8f9fa",
                    color: "#2c3e50",
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "#2c3e50",
                  marginBottom: "1.5rem",
                  paddingBottom: ".5rem",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                🧗‍♂️ Voies réalisées
              </h2>
              <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
                {voies.map((voie, idx) => {
                  const voieData =
                    voie.voie_id !== ""
                      ? listeVoies.find((v) => v.id === Number(voie.voie_id))
                      : null;
                  return (
                    <div
                      key={idx}
                      className="voie-item"
                      style={{
                        background: "white",
                        borderRadius: 8,
                        padding: "1rem",
                        marginBottom: "1rem",
                        borderLeft: "4px solid #e74c3c",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        animation: "slideInLeft 0.3s ease-out",
                        cursor: "pointer",
                        border:
                          selectedVoieIdx === idx
                            ? "2px solid #e74c3c"
                            : "1px solid #e0e0e0",
                      }}
                      onClick={() => setSelectedVoieIdx(idx)}
                    >
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                        <select
                          className="form-select voie-select"
                          value={voie.voie_id}
                          onChange={(e) => handleVoieChange(idx, "voie_id", e.target.value)}
                          style={{
                            flex: 1,
                            marginRight: "1rem",
                            padding: "1rem",
                            border: "2px solid #e0e0e0",
                            borderRadius: 8,
                            fontSize: "1rem",
                            background: "#f8f9fa",
                            color: "#2c3e50", // Couleur texte foncée
                            fontWeight: 600,
                          }}
                        >
                          <option value="">Sélectionner une voie...</option>
                          {listeVoies.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.nom ? `${v.nom} (${v.cotation || ""})` : `Voie #${v.id}`}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="remove-voie"
                          onClick={() => removeVoie(idx)}
                          title="Supprimer cette voie"
                          style={{
                            background: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: 30,
                            height: 30,
                            cursor: "pointer",
                            fontSize: "1rem",
                            transition: "all 0.3s ease",
                          }}
                          disabled={voies.length === 1}
                        >
                          ×
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1rem" }}>
                        <input
                          type="checkbox"
                          checked={voie.reussie}
                          onChange={(e) => handleVoieChange(idx, "reussie", e.target.checked)}
                          style={{ width: 20, height: 20, cursor: "pointer" }}
                          id={`success_${idx}`}
                        />
                        <label
                          htmlFor={`success_${idx}`}
                          style={{ fontWeight: 600, color: "#27ae60", cursor: "pointer" }}
                        >
                          ✓ Voie réussie
                        </label>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: 600,
                            color: "#2c3e50",
                            marginBottom: ".5rem",
                          }}
                        >
                          Avis sur la voie
                        </label>
                        <textarea
                          className="form-textarea"
                          value={voie.avis}
                          onChange={(e) => handleVoieChange(idx, "avis", e.target.value)}
                          placeholder="Vos impressions sur cette voie..."
                          style={{
                            width: "100%",
                            padding: "1rem",
                            border: "2px solid #e0e0e0",
                            borderRadius: 8,
                            fontSize: "1rem",
                            minHeight: 60,
                            background: "#f8f9fa",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addVoie}
                  style={{
                    background: "white",
                    color: "#e74c3c",
                    border: "2px solid #e74c3c",
                    padding: "1rem 2rem",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "1rem",
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  + Ajouter une voie
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  background:
                    "linear-gradient(135deg, #e74c3c, #c0392b)",
                  color: "white",
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Enregistrement..." : "Créer la séance"}
              </button>
            </div>
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "1rem",
                  borderRadius: 8,
                  border: "1px solid #fecaca",
                  marginTop: "2rem",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
          </form>
        </div>
        {/* Aperçu voie + stats (non sticky) */}
        <div>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "2rem",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 32,
              height: "fit-content",
              zIndex: 10,
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "#2c3e50",
                marginBottom: "1.5rem",
                textAlign: "center",
                paddingBottom: "1rem",
                borderBottom: "2px solid #f0f0f0",
              }}
            >
              🎯 Aperçu de la voie
            </h3>
            <div>
              {selectedVoie ? (
                <div
                  className="route-card selected"
                  style={{
                    borderRadius: 12,
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    border: "2px solid #e0e0e0",
                    background: paleBgColor(getDifficultyColor(selectedVoie && selectedVoie.cotation ? selectedVoie.cotation : '#fff')),
                  }}
                >
                  <div
                    className="route-grade"
                    style={{
                      display: "inline-block",
                      padding: "0.3rem 1rem",
                      borderRadius: 20,
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      marginBottom: "1rem",
                      color: "white",
                      background: getDifficultyColor(selectedVoie.cotation || ''),
                    }}
                  >
                    {selectedVoie.cotation || ''}
                  </div>
                  <div
                    className="route-name"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#2c3e50",
                      marginBottom: ".5rem",
                    }}
                  >
                    {selectedVoie.nom}
                  </div>
                  {selectedVoie.ouvreur && (
                    <div
                      className="route-info"
                      style={{ color: "#7f8c8d", fontSize: ".9rem", marginBottom: ".5rem" }}
                    >
                      👤 Ouvreur: {selectedVoie.ouvreur}
                    </div>
                  )}
                  {selectedVoie.description && (
                    <div
                      className="route-info"
                      style={{ color: "#7f8c8d", fontSize: ".9rem", marginBottom: ".5rem" }}
                    >
                      📍 {selectedVoie.description}
                    </div>
                  )}
                  {selectedVoie.type_de_voie && (
                    <div
                      className="route-type"
                      style={{
                        display: "inline-block",
                        background: "#ecf0f1",
                        color: "#7f8c8d",
                        padding: ".2rem .8rem",
                        borderRadius: 15,
                        fontSize: ".8rem",
                        fontWeight: 500,
                      }}
                    >
                      {selectedVoie.type_de_voie}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="empty-state"
                  style={{
                    textAlign: "center",
                    color: "#bdc3c7",
                    fontStyle: "italic",
                    padding: "2rem",
                  }}
                >
                  Sélectionnez une voie pour voir les détails
                </div>
              )}
            </div>
            {/* Stats */}
            <div
              className="session-stats"
              style={{
                background: "#f8f9fa",
                borderRadius: 12,
                padding: "1.5rem",
                marginTop: "1.5rem",
              }}
            >
              <h4
                style={{
                  color: "#2c3e50",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                Statistiques de la séance
              </h4>
              <div
                className="stats-grid"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
              >
                <div className="stat-item" style={{ textAlign: "center" }}>
                  <span
                    className="stat-number"
                    style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e74c3c", display: "block" }}
                  >
                    {totalRoutes}
                  </span>
                  <span
                    className="stat-label"
                    style={{ fontSize: ".8rem", color: "#7f8c8d", textTransform: "uppercase", letterSpacing: ".5px" }}
                  >
                    Voies tentées
                  </span>
                </div>
                <div className="stat-item" style={{ textAlign: "center" }}>
                  <span
                    className="stat-number"
                    style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e74c3c", display: "block" }}
                  >
                    {successfulRoutes}
                  </span>
                  <span
                    className="stat-label"
                    style={{ fontSize: ".8rem", color: "#7f8c8d", textTransform: "uppercase", letterSpacing: ".5px" }}
                  >
                    Voies réussies
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 