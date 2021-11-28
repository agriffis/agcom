// https://stackoverflow.com/a/54955624
export function withProperties<A, B>(component: A, properties: B): A & B {
  Object.keys(properties).forEach(key => {
    ;(component as any)[key] = (properties as any)[key]
  })
  return component as A & B
}
