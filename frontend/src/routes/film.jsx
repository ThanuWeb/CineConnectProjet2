import { createFileRoute } from '@tanstack/react-router'
import Film from '../pages/Films'
export const Route = createFileRoute('/film')({
  component: Film,
})