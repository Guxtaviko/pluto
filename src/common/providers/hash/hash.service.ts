import { Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'

interface Compare {
  digest: string
  hash: string
}

@Injectable()
export class HashService {
  async hash(value: string): Promise<string> {
    if (!value) throw new Error('Value is required')

    const hashed = await hash(value)

    return hashed
  }

  /**
   *
   * @param {Compare} { digest, hash } - digest is the plain text password and hash is the hashed password
   * @returns
   */
  async compare({ digest, hash }: Compare): Promise<boolean> {
    if (!digest || !hash) throw new Error('Digest and hash are required')

    const isMatch = await verify(hash, digest)

    return isMatch
  }
}
