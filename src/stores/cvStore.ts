import { create } from 'zustand';

export interface CVEnseignant {
  enseignantId: number;
  enseignantNom: string;
  enseignantEmail: string;
  enseignantAvatar: string;
  matiere: string;
  experience: string;
  tarif: string;
  ville: string;
  telephone: string;
  bio?: string;
  diplomes: string[];
  experiences: {
    poste: string;
    etablissement: string;
    periode: string;
    description: string;
  }[];
  competences: string[];
  langues: string[];
  cvUrl?: string;
  disponible: boolean;
}

interface CVState {
  cvs: CVEnseignant[];
  getCVByEnseignant: (enseignantId: number) => CVEnseignant | undefined;
}

const mockCVs: CVEnseignant[] = [
  {
    enseignantId: 2,
    enseignantNom: 'Marie Dupont',
    enseignantEmail: 'marie.dupont@email.com',
    enseignantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
    matiere: 'Mathématiques',
    experience: '5 ans',
    tarif: '45 Cfa/h',
    ville: 'Paris',
    telephone: '+33 6 12 34 56 78',
    bio: 'Professeure passionnée de mathématiques avec une approche pédagogique innovante. Spécialisée dans la préparation au baccalauréat et le soutien scolaire personnalisé.',
    diplomes: [
      'Master 2 Mathématiques Appliquées - Université Paris-Saclay (2019)',
      'Licence Mathématiques - Université Paris-Saclay (2017)',
      'CAPES Mathématiques (2020)',
    ],
    experiences: [
      {
        poste: 'Professeure de Mathématiques',
        etablissement: 'Lycée Henri IV, Paris',
        periode: '2021 - Présent',
        description: 'Enseignement des mathématiques en classes de Première et Terminale S. Préparation des élèves au baccalauréat avec un taux de réussite de 95%.',
      },
      {
        poste: 'Professeure Vacataire',
        etablissement: 'Collège Jean Moulin, Lyon',
        periode: '2019 - 2021',
        description: 'Cours de mathématiques en classes de 3ème. Mise en place de cours de soutien et d\'ateliers de méthodologie.',
      },
    ],
    competences: [
      'Pédagogie différenciée',
      'Préparation au baccalauréat',
      'Cours particuliers',
      'Utilisation des outils numériques',
      'Gestion de classe',
    ],
    langues: ['Français (natif)', 'Anglais (courant)', 'Espagnol (intermédiaire)'],
    cvUrl: '/cv/marie-dupont.pdf',
    disponible: true,
  },
  {
    enseignantId: 5,
    enseignantNom: 'Thomas Petit',
    enseignantEmail: 'thomas.petit@email.com',
    enseignantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas',
    matiere: 'Mathématiques',
    experience: '7 ans',
    tarif: '47 Cfa/h',
    ville: 'Marseille',
    telephone: '+33 6 67 89 01 23',
    bio: 'Enseignant expérimenté spécialisé dans les classes préparatoires et le soutien aux étudiants en difficulté.',
    diplomes: [
      'Agrégation de Mathématiques (2017)',
      'Master 2 Mathématiques Fondamentales - ENS Lyon (2016)',
      'Licence Mathématiques - ENS Lyon (2014)',
    ],
    experiences: [
      {
        poste: 'Professeur de Mathématiques',
        etablissement: 'Lycée Thiers, Marseille',
        periode: '2017 - Présent',
        description: 'Enseignement en classes préparatoires scientifiques. Encadrement de projets de recherche étudiants.',
      },
    ],
    competences: [
      'Mathématiques avancées',
      'Préparation aux concours',
      'Recherche mathématique',
      'Méthodologie de travail',
    ],
    langues: ['Français (natif)', 'Anglais (bilingue)', 'Allemand (professionnel)'],
    cvUrl: '/cv/thomas-petit.pdf',
    disponible: true,
  },
];

export const useCVStore = create<CVState>(() => ({
  cvs: mockCVs,

  getCVByEnseignant: (enseignantId) => {
    return mockCVs.find(cv => cv.enseignantId === enseignantId);
  },
}));
