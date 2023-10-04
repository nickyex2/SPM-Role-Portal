'use client';

import { Table } from 'flowbite-react';

export default function HoverState() {
  return (
    <Table hoverable className='rounded-none'>
      <Table.Body className="divide-y">
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 rounded-none">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            Apple MacBook Pro 17
          </Table.Cell>
          <Table.Cell>
            Sliver
          </Table.Cell>
          <Table.Cell>
            Laptop
          </Table.Cell>
          <Table.Cell>
            $2999
          </Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>
                Edit
              </p>
            </a>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            <p>
              Microsoft Surface Pro
            </p>
          </Table.Cell>
          <Table.Cell>
            White
          </Table.Cell>
          <Table.Cell>
            Laptop PC
          </Table.Cell>
          <Table.Cell>
            $1999
          </Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>
                Edit
              </p>
            </a>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            Magic Mouse 2
          </Table.Cell>
          <Table.Cell>
            Black
          </Table.Cell>
          <Table.Cell>
            Accessories
          </Table.Cell>
          <Table.Cell>
            $99
          </Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>
                Edit
              </p>
            </a>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}


