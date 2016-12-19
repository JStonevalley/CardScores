import DataObject from './dataObject'

export default class Repository<ID, D extends DataObject<ID>> {
  private readonly store = new Map<ID, D[]>()
  save(entity: D): void {
    const states = this.store.get(entity.id) || []
    states.push(entity)
    this.store.set(entity.id, states)
  }

  fetch(entityId: ID): D {
    if (this.store.has(entityId)) {
      const states = this.store.get(entityId)
      return states[states.length - 1]
    } else {
      return null
    }
  }

  exists(entityId: ID): Boolean {
    return this.store.has(entityId)
  }
}
