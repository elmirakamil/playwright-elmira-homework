import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
    //1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByText('Search').click()
    //2. Add assertion of the "Owners" text displayed
    await expect(page.getByRole("heading")).toHaveText("Owners")
})
test('validate selected pet types from the list', async ({ page }) => {
    // 3. Select the first owner "George Franklin"
    const petOwner = page.getByText('George Franklin')
    await petOwner.click()

    //4. Add the assertion for the owner "Name", the value "George Franklin" is displayed
    await expect(page.locator('.ownerFullName')).toHaveText('George Franklin')

    //5. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with a name "Leo"
    await page.getByRole('button', { name: 'Edit Pet' }).click()

    //6. Add assertion of "Pet" text displayed as header on the page
    await expect(page.getByRole("heading")).toHaveText("Pet")

    //7. Add the assertion "George Franklin" name is displayed in the "Owner" field
    await expect(page.locator('#owner_name')).toHaveValue('George Franklin')

    //8. Add the assertion the value "cat" is displayed in the "Type" field
    const petTypesfield = page.locator('#type1')
    await expect(petTypesfield).toHaveValue('cat')

    //9. Using a loop, select the values from the drop-down one by one, and add the assertion,
    // that every selected value from the drop-down is displayed in the "Type" field
    const petTypesOption = await page.locator('option').allTextContents()

    for (const petTypeOption of petTypesOption) {
        await page.selectOption('select', petTypeOption)
        await expect(petTypesfield).toHaveValue(petTypeOption)
    }
})
test('validate the pet type update', async ({ page }) => {
    //3. Select the owner "Eduardo Rodriquez"
    await page.getByText('Eduardo Rodriquez').click()
    //4. In the "Pets and Visits" section, click on "Edit Pet" button for the pet with a name "Rosy"
    const editButton = page.getByText('Rosy').locator('..').getByText('Edit Pet')
    await editButton.click()

    //5. Add the assertion that name "Rosy" is displayed in the input field "Name"
    await expect(page.locator('#name')).toHaveValue('Rosy')

    //6. Add the assertion the value "dog" is displayed in the "Type" field
    const valueInTypeField = page.locator('#type1')
    await expect(valueInTypeField).toHaveValue('dog')

    //7. From the drop-down menu, select the value "bird"
    await page.getByLabel('Type').selectOption('bird');

    //8. On the "Pet details" page,
    //add the assertion the value "bird" is displayed in the "Type" field as well as drop-down input field
    await expect(valueInTypeField).toHaveValue('bird')

    //9. Select "Update Pet" button
    const updateButton = page.getByRole('button', { name: "Update Pet" })
    await updateButton.click()

    //10. On the "Owner Information" page, add the assertion that pet "Rosy" has a new value of the Type "bird"
    const petsAndVisitsRosyTypeValue = page.getByText('Rosy').locator('..').locator('dd').last()
    await expect(petsAndVisitsRosyTypeValue).toHaveText('bird')

    //11. Select "Edit Pet" button one more time,
    //and perform steps 6-10 to revert the selection of the pet type "bird" to its initial value "dog"
    //Click on Edit Pet button
    await editButton.click()

    //Revert dog selection from the dropdown
    await page.selectOption('select', 'dog')

    //Assert the value is 'dog'
    await expect(valueInTypeField).toHaveValue('dog')

    //Click on 'Update Pet' button to save the changes
    updateButton.click()

    //Validate that Rosy's pet is reverted back to 'dog
    await expect(petsAndVisitsRosyTypeValue).toHaveText('dog')
})