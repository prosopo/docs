import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: 'Rechercher',
	placeholder: 'Rechercher la documentation',
	shortcutLabel: 'Appuyez sur / pour rechercher',
	resultsFooterLede: 'Cherchez-vous une intégration Prosopo ou une documentation ? Besoin d’aide ?',
	resultsFooterIntegrations: 'Répertoire des intégrations Prosopo',
	resultsFooterThemes: 'Showcase des thèmes Prosopo',
	resultsFooterDiscord: 'Rejoignez-nous sur Discord',
	modal: {
		searchBox: {
			resetButtonTitle: 'Effacer la recherche',
			resetButtonAriaLabel: 'Effacer la recherche',
			cancelButtonText: 'Annuler',
			cancelButtonAriaLabel: 'Annuler',
		},
		startScreen: {
			recentSearchesTitle: 'Recherches récentes',
			noRecentSearchesText: 'Aucune recherche récente',
			saveRecentSearchButtonTitle: 'Sauvegarder cette recherche',
			removeRecentSearchButtonTitle: 'Enlever cette recherche de l\'historique',
			favoriteSearchesTitle: 'Favoris',
			removeFavoriteSearchButtonTitle: 'Enlever cette recherche des favoris',
		},
		errorScreen: {
			titleText: 'Erreur lors de la récupération des résultats',
			helpText: 'Vous devriez vérifier l\'état de votre connexion Internet.',
		},
		footer: {
			selectText: 'pour sélectionner',
			selectKeyAriaLabel: 'Appuyez sur la touche',
			navigateText: 'pour naviguer',
			navigateUpKeyAriaLabel: 'Flèche vers le haut',
			navigateDownKeyAriaLabel: 'Flèche vers le bas',
			closeText: 'pour fermer',
			closeKeyAriaLabel: 'Touche Échappement',
			searchByText: 'Recherche par',
		},
		noResultsScreen: {
			noResultsText: 'Aucun résultat trouvé pour',
			suggestedQueryText: 'Essayez de rechercher pour',
			reportMissingResultsText: 'Vous pensez que cette requête devrait renvoyer des résultats ?',
			reportMissingResultsLinkText: 'Faites-le-nous savoir.',
		},
	},
});
