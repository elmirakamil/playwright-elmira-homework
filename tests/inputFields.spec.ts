import { test, expect } from '@playwright/test';
//1 and 2 create a before each to go to the url, click on the navigation bar PET TYPES and assertion for "Pet Types" text
test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Pet Types').click()

    await expect(page.getByRole("heading")).toHaveText("Pet Types")
})

//3. Click on "Edit" button for the "cat" pet type
test('change the name of the cat', async ({ page }) => {
    const petTypesCatEditButton = page.getByRole('button', { name: "Edit" }).first()
    await petTypesCatEditButton.click()


    //4. Add assertion of the "Edit Pet Type" text displayed
    await expect(page.getByRole("heading")).toHaveText('Edit Pet Type')


    //5. Change the pet type name from "cat" to "rabbit" and click "Update" button
    const editPetTypeInputField = page.locator('#name')
    await editPetTypeInputField.click()
    await editPetTypeInputField.clear()
    await editPetTypeInputField.fill('rabbit')
    await page.getByRole('button', { name: 'Update' }).click()

    //6. Add the assertion that the first pet type in the list of types has a value "rabbit" 
    const firstPetType = page.locator('input[name=pettype_name]').first()
    await expect(firstPetType).toHaveValue('rabbit')


    //7. Click on "Edit" button for the same "rabbit" pet type

    await petTypesCatEditButton.click()

    //8. Change the pet type name back from "rabbit" to "cat" and click "Update" button

    await editPetTypeInputField.click()
    await editPetTypeInputField.clear()
    await editPetTypeInputField.fill('cat')
    await page.getByRole('button', { name: 'Update' }).click()

    //9. Add the assertion that the first pet type in the list of names has a value "cat"
    await expect(firstPetType).toHaveValue('cat')
})

test('Cancel pet type update', async ({ page }) => {
    //since we have 1 and 2 steps in before each, starting from step 3
    //3. Click on "Edit" button for the "dog" pet type

    await page.getByRole('button', { name: 'Edit' }).nth(1).click()

    //4. Type the new pet type name "moose"
    const editPetTypeInputField = page.locator('#name')
    await editPetTypeInputField.click()
    await editPetTypeInputField.clear()
    await editPetTypeInputField.fill('moose')


    //5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
    await expect(editPetTypeInputField).toHaveValue('moose')

    //6. Click on "Cancel" button
    await page.locator('button', { hasText: 'Cancel' }).click()

    //7. Add the assertion the value "dog" is still displayed in the list of pet types

    await expect(page.locator('input[name=pettype_name]').nth(1)).toHaveValue('dog')
})

test('Pet type name is required validation', async ({ page }) => {
    //since we have 1 and 2 steps in before each, starting from step 3
    //3. Click on "Edit" button for the "lizard" pet type
    await page.getByRole('button', { name: 'Edit' }).nth(2).click()

    //4. On the Edit Pet Type page, clear the input field
    const editPetTypeInputField = page.locator('#name')
    await editPetTypeInputField.click()
    await editPetTypeInputField.clear()

    //5. Add the assertion for the "Name is required" message below the input field
    await expect(page.locator('.help-block')).toContainText('Name is required')

    //6. Click on "Update" button
    await page.getByRole('button', { name: 'Update' }).click()

    //7. Add assertion that "Edit Pet Type" page is still displayed
    await expect(page.getByRole("heading")).toHaveText('Edit Pet Type')

    //8. Click on the "Cancel" button
    await page.getByRole('button', { name: 'Cancel' }).click()

    //9. Add assertion that "Pet Types" page is displayed
    await expect(page.getByRole("heading")).toHaveText("Pet Types")
})