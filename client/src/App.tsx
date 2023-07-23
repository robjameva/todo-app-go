import { Box, List, ThemeIcon, Flex } from '@mantine/core'
import useSWR from "swr"
import AddTodo from './components/AddTodo'
import { CheckCircleFillIcon, TrashIcon } from '@primer/octicons-react';

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

export const ENDPOINT = 'http://localhost:4000'

const fetcher = (url: string) => fetch(`${ENDPOINT}/${url}`).then((r) => r.json())

function App() {

  const { data, mutate } = useSWR<Todo[]>('api/todos', fetcher)

  async function markTodoDone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: 'PATCH'
    }).then(r => r.json())

    mutate(updated)
  }

  async function deleteTodo(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}`, {
      method: 'DELETE',

    }).then(r => r.json())

    mutate(updated)
  }

  return (
    <Box
      sx={() => ({
        padding: '2rem',
        width: '100%',
        maxWidth: '30rem',
        margin: '0 auto'
      })}
    >
      <List spacing="xs" size="sm" mb={12} center >
        {data?.map((todo) => {
          return (
            <Flex
              justify="space-between"
            >
              <List.Item
                key={`todo__${todo.id}`}
                mb={12}
                icon={todo.done ?
                  (<ThemeIcon color='teal' size={24} radius='xl' >
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                  ) :
                  (<ThemeIcon color='gray' size={24} radius='xl'
                    onClick={() => markTodoDone(todo.id)}
                  >
                    <CheckCircleFillIcon size={20} />
                  </ThemeIcon>
                  )}
              >
                {todo.title}
              </List.Item>
              <ThemeIcon color='red'
                onClick={() => deleteTodo(todo.id)}
              >
                <TrashIcon size={16} />
              </ThemeIcon>
            </Flex>
          )
        })}
      </List>
      <AddTodo mutate={mutate} />
    </Box>
  )
}

export default App
