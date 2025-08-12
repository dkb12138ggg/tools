declare module 'crypto-js' {
  namespace CryptoJS {
    namespace enc {
      const Utf8: { parse(input: string): any }
    }
    namespace lib {
      class Hasher {
        update(data: any): void
        finalize(): any
      }
      const WordArray: { create(data: ArrayBuffer | any): any }
    }
    namespace algo {
      const MD5: { create(): lib.Hasher }
      const SHA1: { create(): lib.Hasher }
      const SHA256: { create(): lib.Hasher }
    }
    function MD5(data: any): { toString(): string }
    function SHA1(data: any): { toString(): string }
    function SHA256(data: any): { toString(): string }
  }
  export default CryptoJS
}

