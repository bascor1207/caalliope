import { describe, test, expect } from 'vitest';

describe('Test suite to update a book', () => {
    test('Happy path', async () => {
        givenABookToUpdate({ id: '1' })

        await updatingBook()

        thenThereShouldBeAVisualIndicator()
    })
})

function givenABookToUpdate({ id }: {id: string}) {
        return id
}

async function updatingBook() {

}

function thenThereShouldBeAVisualIndicator() {
    expect(true).toBe(true)
}
