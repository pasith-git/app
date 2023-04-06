export default function exclude<Any, Key extends keyof Any>(
    user: Any,
    keys: Key[]
  ): Omit<Any, Key> {
    for (let key of keys) {
      delete user[key]
    }
    return user
  }