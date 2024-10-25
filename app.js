// Fonction pour récupérer des données d'Alchemy via le proxy
async function getAlchemyData() {
    try {
        const response = await fetch('/api/alchemyProxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'getBlockNumber' }) // Body personnalisé si besoin
        });

        const data = await response.json();
        console.log('Current block number:', data.blockNumber);
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
    }
}

const contractAddress = "0xD48Cb715181E186a9ADDcbd3aadd4A11F24731E2"; 
const abi = [
    "function feed() public",
    "function pet() public",
    "function walk() public",
    "function getStatus() public view returns (string)"
];

// Fonction pour vérifier Metamask et initialiser le provider
async function connectWallet() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum); // Fournisseur via Metamask
        await provider.send("eth_requestAccounts", []); // Demande de connexion Metamask
        const signer = provider.getSigner(); // Récupérer le signer après connexion

        const tamagotchiContract = new ethers.Contract(contractAddress, abi, signer); // Initialisation du contrat
        console.log('Wallet connecté et contrat initialisé');

        // Afficher les boutons d'action après connexion
        document.getElementById('actions').style.display = 'block';

        // Charger le statut du Tamagotchi
        updateStatus(tamagotchiContract);
    } catch (error) {
        console.error("Error connecting wallet: ", error);
    }
}

// Fonction pour nourrir le Tamagotchi
async function feedTamagotchi(tamagotchiContract) {
    try {
        const tx = await tamagotchiContract.feed(); // Appel à la fonction feed du contrat
        await tx.wait();
        updateStatus(tamagotchiContract);
    } catch (error) {
        console.error("Error feeding Tamagotchi: ", error);
    }
}

// Fonction pour mettre à jour le statut du Tamagotchi
async function updateStatus(tamagotchiContract) {
    try {
        const status = await tamagotchiContract.getStatus(); // Récupérer le statut actuel
        document.getElementById('status').textContent = status; // Mettre à jour le DOM
    } catch (error) {
        console.error("Error getting status: ", error);
    }
}

// Écouteur d'événements pour le bouton de connexion
document.getElementById('connect-wallet-btn').addEventListener('click', connectWallet);

// Écouteur d'événements pour nourrir le Tamagotchi
document.getElementById('feed-btn').addEventListener('click', async () => {
    const tamagotchiContract = new ethers.Contract(contractAddress, abi, new ethers.providers.Web3Provider(window.ethereum).getSigner());
    feedTamagotchi(tamagotchiContract);
});

// Vérifier si Metamask est installé au chargement de la page
window.onload = async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('Metamask is installed');
    } else {
        alert('Please install MetaMask!');
    }
};
