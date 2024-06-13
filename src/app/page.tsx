'use client'
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { useState } from 'react'

function App() {
  const account = useAccount()
  const { connectors, connectAsync, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const [isVerified, setIsVerified] = useState(false)

  const handleConnect = async (connector: Connector) => {
    try {
      const connectResult = await connectAsync({ connector })

      const message = "Please sign this message to verify your wallet."
      const signature = await signMessageAsync({ message })

      if (signature) {
        setIsVerified(true)
        console.log("Connected and verified", connectResult)
      } else {
        disconnect()
        setIsVerified(false)
        console.log("Verification failed, disconnected")
      }
    } catch (err) {
      console.error("Error connecting:", err)
      disconnect()
      setIsVerified(false)
    }
  }

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => {
            disconnect()
            setIsVerified(false)
          }}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {!isVerified ? (
          <div>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                type="button"
              >
                {connector.name}
              </button>
            ))}
          </div>
        ) : (
          <div>Wallet verified and connected!</div>
        )}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  )
}

export default App
