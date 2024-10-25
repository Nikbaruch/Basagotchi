// Fonction pour récupérer des données d'Alchemy via le proxy
async function getAlchemyData() {
    try {
        const response = await fetch('/api/alchemyProxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'getBlockNumber' })
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
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const tamagotchiContract = new ethers.Contract(contractAddress, abi, signer);
        console.log('Wallet connecté et contrat initialisé');

        // Afficher les boutons d'action après connexion
        document.getElementById('actions').style.display = 'block';

        // Afficher le message de connexion réussie
        document.getElementById('status').textContent = "Wallet connected";

        // Charger le statut du Tamagotchi
        updateStatus(tamagotchiContract);
    } catch (error) {
        console.error("Error connecting wallet: ", error);
    }
}

// Fonction pour nourrir le Tamagotchi avec un message de confirmation
async function feedTamagotchi(tamagotchiContract) {
    try {
        const tx = await tamagotchiContract.feed();
        await tx.wait();
        document.getElementById('status').textContent = "Basagotchi feeded";
        updateStatus(tamagotchiContract);
    } catch (error) {
        console.error("Error feeding Tamagotchi: ", error);
    }
}

// Fonction pour caresser le Tamagotchi avec un message de confirmation
async function petTamagotchi(tamagotchiContract) {
    try {
        const tx = await tamagotchiContract.pet();
        await tx.wait();
        document.getElementById('status').textContent = "Basagotchi loved";
        updateStatus(tamagotchiContract);
    } catch (error) {
        console.error("Error petting Tamagotchi: ", error);
    }
}

// Fonction pour promener le Tamagotchi avec un message de confirmation
async function walkTamagotchi(tamagotchiContract) {
    try {
        const tx = await tamagotchiContract.walk();
        await tx.wait();
        document.getElementById('status').textContent = "Basagotchi tired";
        updateStatus(tamagotchiContract);
    } catch (error) {
        console.error("Error walking Tamagotchi: ", error);
    }
}

// Fonction pour mettre à jour le statut du Tamagotchi
async function updateStatus(tamagotchiContract) {
    try {
        const status = await tamagotchiContract.getStatus();
        document.getElementById('status').textContent = status;
    } catch (error) {
        console.error("Error getting status: ", error);
    }
}

// Écouteur d'événements pour le bouton de connexion
document.getElementById('connect-wallet-btn').addEventListener('click', connectWallet);

// Écouteurs d'événements pour les actions avec le Tamagotchi
document.getElementById('feed-btn').addEventListener('click', async () => {
    const tamagotchiContract = new ethers.Contract(contractAddress, abi, new ethers.providers.Web3Provider(window.ethereum).getSigner());
    feedTamagotchi(tamagotchiContract);
});

document.getElementById('pet-btn').addEventListener('click', async () => {
    const tamagotchiContract = new ethers.Contract(contractAddress, abi, new ethers.providers.Web3Provider(window.ethereum).getSigner());
    petTamagotchi(tamagotchiContract);
});

document.getElementById('walk-btn').addEventListener('click', async () => {
    const tamagotchiContract = new ethers.Contract(contractAddress, abi, new ethers.providers.Web3Provider(window.ethereum).getSigner());
    walkTamagotchi(tamagotchiContract);
});

// Vérifier si Metamask est installé au chargement de la page
window.onload = async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('Metamask is installed');
    } else {
        alert('Please install MetaMask!');
    }
};
