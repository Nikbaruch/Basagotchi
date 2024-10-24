const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
let signer;
let tamagotchiContract;

const contractAddress = "0xD48Cb715181E186a9ADDcbd3aadd4A11F24731E2";
const abi = [
    "function feed() public",
    "function pet() public",
    "function walk() public",
    "function getStatus() public view returns (string)"
];

// Sélectionne les éléments DOM
const connectWalletButton = document.getElementById('connect-wallet-btn');
const feedButton = document.getElementById('feed-btn');
const petButton = document.getElementById('pet-btn');
const walkButton = document.getElementById('walk-btn');
const statusDisplay = document.getElementById('status');
const actionsDiv = document.getElementById('actions');
const dogFace = document.getElementById('dog-face');

// Changer la tête du chien en fonction de l'action
function updateDogFace(expression) {
    switch (expression) {
        case 'happy':
            dogFace.textContent = '🐶'; // Tête heureuse
            break;
        case 'neutral':
            dogFace.textContent = '🐕'; // Tête normale
            break;
        case 'excited':
            dogFace.textContent = '🐕‍🦺'; // Tête après la promenade
            break;
        default:
            dogFace.textContent = '🐕'; // Par défaut
    }

    // Ajouter un petit effet d'animation de saut
    dogFace.style.animation = 'dogBounce 0.5s';
}

// Vérifie si Metamask est installé
async function checkMetamaskInstalled() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return false;
    }
    return true;
}

// Fonction pour connecter le wallet
async function connectWallet() {
    try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        tamagotchiContract = new ethers.Contract(contractAddress, abi, signer);

        // Met à jour l'interface utilisateur après la connexion
        connectWalletButton.style.display = 'none';
        actionsDiv.style.display = 'block';
        updateStatus();
    } catch (error) {
        console.error("Error connecting wallet: ", error);
    }
}

// Fonction pour mettre à jour le statut du Tamagotchi
async function updateStatus() {
    try {
        const status = await tamagotchiContract.getStatus();
        statusDisplay.textContent = status;
    } catch (error) {
        console.error("Error getting status: ", error);
    }
}

// Fonction pour nourrir le Tamagotchi
async function feedTamagotchi() {
    try {
        const tx = await tamagotchiContract.feed();
        await tx.wait();
        updateDogFace('happy');
        updateStatus();
    } catch (error) {
        console.error("Error feeding Tamagotchi: ", error);
    }
}

// Fonction pour caresser le Tamagotchi
async function petTamagotchi() {
    try {
        const tx = await tamagotchiContract.pet();
        await tx.wait();
        updateDogFace('happy');
        updateStatus();
    } catch (error) {
        console.error("Error petting Tamagotchi: ", error);
    }
}

// Fonction pour promener le Tamagotchi
async function walkTamagotchi() {
    try {
        const tx = await tamagotchiContract.walk();
        await tx.wait();
        updateDogFace('excited');
        updateStatus();
    } catch (error) {
        console.error("Error walking Tamagotchi: ", error);
    }
}

// Écouteurs d'événements pour les boutons
connectWalletButton.addEventListener('click', connectWallet);
feedButton.addEventListener('click', feedTamagotchi);
petButton.addEventListener('click', petTamagotchi);
walkButton.addEventListener('click', walkTamagotchi);

// Vérifie si Metamask est disponible au chargement de la page
window.onload = async () => {
    if (await checkMetamaskInstalled()) {
        console.log('Metamask is installed');
    }
};
