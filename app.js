// Importation d'ethers.js (assurez-vous que ethers.js est chargé dans votre HTML ou importé)
const provider = new ethers.providers.JsonRpcProvider('https://base-mainnet.g.alchemy.com/v2/DawI2TgDeyVcz8cH_OE6WZ6RQvKxPRE5');

async function getBlockNumber() {
    try {
        const blockNumber = await provider.getBlockNumber();  // Récupère le numéro du dernier bloc sur la blockchain
        console.log('Current block number: ', blockNumber);  // Affiche le numéro du bloc dans la console
    } catch (error) {
        console.error('Error fetching block number:', error);  // Gérer les erreurs en cas de problème
    }
}

getBlockNumber();  // Appelle la fonction pour obtenir le numéro de bloc



