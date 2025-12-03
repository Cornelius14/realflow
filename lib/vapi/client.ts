export interface VapiConfig {
  publicKey: string
  assistantId: string
}

export class VapiClient {
  private publicKey: string
  private assistantId: string
  private vapiInstance: any = null

  constructor(config: VapiConfig) {
    this.publicKey = config.publicKey
    this.assistantId = config.assistantId
  }

  async loadVapi() {
    if (typeof window === "undefined") return null

    // Load Vapi script if not already loaded
    if (!window.vapiSDK) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
        script.async = true
        script.onload = () => {
          this.initializeVapi()
          resolve(this.vapiInstance)
        }
        script.onerror = reject
        document.head.appendChild(script)
      })
    } else {
      this.initializeVapi()
      return this.vapiInstance
    }
  }

  private initializeVapi() {
    if (window.vapiSDK && !this.vapiInstance) {
      this.vapiInstance = window.vapiSDK.run({
        apiKey: this.publicKey,
        assistant: this.assistantId,
      })
    }
  }

  async startCall() {
    const vapi = await this.loadVapi()
    if (vapi && vapi.start) {
      await vapi.start(this.assistantId)
    }
  }

  async endCall() {
    if (this.vapiInstance && this.vapiInstance.stop) {
      this.vapiInstance.stop()
    }
  }

  onCallStart(callback: () => void) {
    if (this.vapiInstance) {
      this.vapiInstance.on("call-start", callback)
    }
  }

  onCallEnd(callback: () => void) {
    if (this.vapiInstance) {
      this.vapiInstance.on("call-end", callback)
    }
  }

  onError(callback: (error: any) => void) {
    if (this.vapiInstance) {
      this.vapiInstance.on("error", callback)
    }
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    vapiSDK?: any
  }
}
