async function fetchAlchemyData() {
  try {
    const response = await fetch('/api/alchemyProxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ /* tes paramètres ici */ }),
    });

    const data = await response.json();
    console.log('Données reçues:', data);
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
  }
}

fetchAlchemyData();




// Remplace 'YOUR_ALCHEMY_API_KEY' par la clé d'API Alchemy obtenue dans le tableau de bord
// Ton code pour interagir avec le contrat
let signer;
let tamagotchiContract;

const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []); // Demande à Metamask de se connecter
const signer = provider.getSigner();


const contractAddress = "0xD48Cb715181E186a9ADDcbd3aadd4A11F24731E2";  // Ton adresse de contrat
const abi = [
    "function feed() public",
    "function pet() public",
    "function walk() public",
    "function getStatus() public view returns (string)"
];

// Vérifie si Metamask est installé
async function checkMetamaskInstalled() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return false;
    }
    return true;
}

// Connecter le wallet si tu utilises Metamask
async function connectWallet() {
    try {
        await provider.send("eth_requestAccounts", []); // Demande de connexion Metamask
        signer = provider.getSigner(); // Utilise le signer pour signer des transactions
        tamagotchiContract = new ethers.Contract(contractAddress, abi, signer);

        // Après connexion, tu peux faire d'autres actions
    } catch (error) {
        console.error("Error connecting wallet: ", error);
    }
}

// Fonction pour nourrir le Tamagotchi
async function feedTamagotchi() {
    try {
        const tx = await tamagotchiContract.feed();
        await tx.wait();
        updateStatus();
    } catch (error) {
        console.error("Error feeding Tamagotchi: ", error);
    }
}

// Fonction pour mettre à jour le statut du Tamagotchi
async function updateStatus() {
    try {
        const status = await tamagotchiContract.getStatus();
        document.getElementById('status').textContent = status;
    } catch (error) {
        console.error("Error getting status: ", error);
    }
}

// Écouteurs d'événements pour les boutons
document.getElementById('feed-btn').addEventListener('click', feedTamagotchi);

// Vérifie si Metamask est disponible au chargement de la page
window.onload = async () => {
    if (await checkMetamaskInstalled()) {
        console.log('Metamask is installed');
    }
};

