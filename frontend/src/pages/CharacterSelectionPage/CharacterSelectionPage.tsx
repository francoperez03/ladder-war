import { useEffect, useState } from "react";
import "./CharacterSelectionPage.css";
import { AztecAddress } from "@aztec/aztec.js";
import { useNavigate } from "react-router-dom";
import { getDeployedTestAccountsWallets } from "@aztec/accounts/testing";
import { PXEFactory } from "../../factories/PXEFactory";



const CharacterSelectionPage = () => {
  const [pxeConnected, setPxeConnected] = useState(false);
  const [accounts, setAccounts] = useState<AztecAddress[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  // const [isDeploying, setIsDeploying] = useState(false); // Estado para indicar si el contrato se está desplegando
  // const [contractAddress, setContractAddress] = useState<string | null>(null); // Dirección del contrato desplegado
  const navigate = useNavigate();

  useEffect(() => {
    const connectToPXE = async () => {
      try {
        const pxe = await PXEFactory.getPXEInstance();
        const { l1ChainId } = await pxe.getNodeInfo();
        console.log(`Connected to chain ${l1ChainId}`);
        setPxeConnected(true);

        const userAccounts = await pxe.getRegisteredAccounts();
        const wallets = await getDeployedTestAccountsWallets(pxe);
        console.log("wallets", wallets);
        setAccounts(userAccounts.map((account) => account.address));
      } catch (err) {
        if (err instanceof Error) {
          console.error(`Error connecting to PXE: ${err.message}`);
        } else {
          console.error("Error connecting to PXE:", err);
        }
        setError("Failed to connect to PXE");
      }
    };

    connectToPXE();
  }, []);

  // const handleDeployContract = async () => {
  //   try {
  //     setIsDeploying(true);
  //     const address = await deployContract();
  //     setContractAddress(address);
  //     alert(`Contract deployed at ${address}`);
  //   } catch (err) {
  //     console.error("Error deploying contract:", err);
  //     alert("Failed to deploy contract.");
  //   } finally {
  //     setIsDeploying(false);
  //   }
  // };

  const handleCharacterSelect = (index: number) => {
    setSelectedCharacter(index);
  };

  const handlePlay = () => {
    if (selectedCharacter !== null) {
      navigate("/game", { state: { selectedCharacter: accounts[0], indexCharacter: selectedCharacter } });
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Freedom Race</h1>
      <p>Status: {pxeConnected ? "Connected to PXE" : error || "Not connected to PXE"}</p>
      <div style={{ marginTop: "1rem" }}>
        {accounts.length > 0 ? (
          accounts.map((account, index) => (
            <button
              key={index}
              style={{
                padding: "0.5rem 1rem",
                margin: "0.5rem",
                border: selectedCharacter === index ? "2px solid green" : "1px solid gray",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleCharacterSelect(index)}
            >
              {`Account ${index + 1}: ${account.toString().slice(0, 5)}...${account.toString().slice(-4)}`}
            </button>
          ))
        ) : (
          <p>No accounts loaded</p>
        )}
      </div>
      <button
        style={{
          padding: "0.5rem 1rem",
          marginTop: "1rem",
          backgroundColor: selectedCharacter !== null ? "blue" : "gray",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: selectedCharacter !== null ? "pointer" : "not-allowed",
        }}
        onClick={handlePlay}
        disabled={selectedCharacter === null}
      >
        Jugar
      </button>
      {/* <button
        style={{
          padding: "0.5rem 1rem",
          marginTop: "1rem",
          backgroundColor: isDeploying ? "gray" : "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isDeploying ? "not-allowed" : "pointer",
        }}
        onClick={()=>{}}
        disabled={isDeploying}
      >
        {isDeploying ? "Deploying..." : "Deploy Contract"}
      </button>
      {contractAddress && <p>Contract deployed at: {contractAddress}</p>} */}
    </div>
  );
};

export default CharacterSelectionPage;
