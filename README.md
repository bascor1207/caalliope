# Caalliope Front

## Description

Ce projet est développé avec **Next.js**, **Redux** et **Vitest**. Il utilise **Tailwind CSS** pour la mise en page.

## Prérequis

- Bonne compréhension de **JavaScript** et **TypeScript**
- Bonne compréhension de **React** et **Redux**
- Connaissance de **Tailwind CSS**

## Installation

1. Clonez ce dépôt :
    
   ```bash
   git clone https://github.com/mon-utilisateur/mon-projet.git
   ```

2. Accédez au répertoire du projet :

    ```bash
    cd mon-projet
    ```
      
3. Installez les dépendances :
    
   ```bash
   npm i --legacy-peer-deps (pour éviter les erreurs de peer dependencies)
   ```
   
4. Copiez le fichier .env.template et créez un .env.local pour définir vos variables d'environnement.

## Lancer le serveur de développement

```bash
npm run dev
```
**Le serveur de développement sera démarré par défault sur le port 3000 de votre localhost.**

## Utiliser l'application sans backend

**Si vous souhaitez tester l'application sans backend connecté :**

1. Aller dans mainSSR et mainClient
2. Commenter toutes les instances des différentes HttpGateways
3. Décommenter toutes les instances des différentes FakeGateways

Cela vous permettra de tester l'application avec des données factices pour un aperçu sans backend.

## Lancer les tests

```bash
npm run test
```

## Tester le build
```bash
npm run build
```

## Lancer l'application

```bash
npm run build
npm run start
```
