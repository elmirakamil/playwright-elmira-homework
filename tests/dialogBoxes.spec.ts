import { test, expect } from '@playwright/test';
//1. Select the PET TYPES menu item in the navigation bar
test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Pet Types').click()

    //2. On the "Pet Types" page, add assertion of the "Pet Types" text displayed above the table with the list of pet types
    await expect(page.getByRole("heading")).toHaveText("Pet Types")
})

test('add and delete pet type', async ({ page }) => {
    //3. Click on "Add" button
    await page.getByRole('button', { name: 'Add' }).click()

    // 4. Add assertions of "New Pet Type" section title, 
    await expect(page.locator('h2').nth(1)).toHaveText('New Pet Type')

    //"Name" header for the input field
    await expect(page.locator('label')).toHaveText('Name')

    // the input field is visible
    const inputValue = page.locator('#name')
    await expect(inputValue).toBeVisible()

    //5. Add a new pet type with the name "pig" and click "Save" button
    await inputValue.fill('pig')
    await page.getByText("Save").click()

    //6. Add assertion that the last item in the list of pet types has value of "pig"
    await expect(page.locator('table input').last()).toHaveValue('pig')

    //7. Click on "Delete" button for the "pig" pet type
    page.on('dialog', dialog => {
        //8. Add assertion to validate the message of the dialog box "Delete the pet type?"
        expect(dialog.message()).toEqual('Delete the pet type?')

        //9. Click on OK button on the dialog box
        dialog.accept()
    })
    //yes, it removes last added value ))))
    await page.getByRole('button', { name: 'Delete' }).last().click()

    //10. Add assertion, that the last item in the list of pet types is not the "pig"
    await expect(page.getByRole('textbox').last()).not.toHaveValue('pig')
})