export type Scene = {
  id: string
  enter: () => void
  exit: () => void
  update: (dtMs: number) => void
}
