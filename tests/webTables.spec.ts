import { test, expect } from '@playwright/test';

//1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByText('Search').click()
})

test('validate the pet name city of the owner', async ({ page }) => {
    //2. In the list of Owners, locate the owner by the name "Jeff Black".

    const row = page.getByRole('row', { name: 'Jeff Black' })

    //Add the assertions that this owner is from the city of "Monona" 
    await expect(row.locator('td').nth(2)).toHaveText('Monona')

    //he has a pet with a name "Lucky"
    await expect(row.locator('td').nth(4)).toHaveText('Lucky')
})

test('validate owners count of the Madison city', async ({ page }) => {
    //2. In the list of Owners, locate all owners who live in the city of "Madison".
    // Add the assertion that the total number of owners should be 4
    await expect(page.getByRole('row', { name: 'Madison' })).toHaveCount(4)
})

test('validate search by the last name', async ({ page }) => {
    //2. On the Owners page, in the "Last name" input field, type the last name "Black", "Davis","Es","Playwright" and click the  "Find Owner" button
    //3. Add the assertion that the displayed owner in the table has a last name "Black", "Davis","Es","Playwright"
    const lastNames = ["Black", "Davis", "Es", "Playwright"]

    for (const lastName of lastNames) {
        await page.getByRole('textbox').fill(lastName)
        await page.getByText('Find Owner').click()

        await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/owners?lastName*")

        //validate Playwright is not a last name exclude it
        const rows = await page.locator('.ownerFullName').all()
        for (const row of rows) {
            if (lastName !== 'Playwright') {
                await expect(row).toContainText(lastName)
            }
            else {
                //Add the assertion of the message "No owners with LastName starting with "Playwright",
                //The message should be displayed if the last name is not found in the table.
                await expect(page.locator('div.container.xd-container div').last()).toHaveText('No owners with LastName starting with \"Playwright\"')
            }
        }
    }
})

test('validate phone number and pet name on the Owner Information page', async ({ page }) => {
    //2. Locate the owner by the phone number "6085552765". 
    //Extract the Pet name displayed in the table for the owner and save it to the variable. Click on this owner.
    const phoneNumber = '6085552765'
    const row = page.getByRole('row', { name: phoneNumber })
    const petName = await row.locator('td').nth(4).textContent()
    await row.getByRole('link').click()

    //3. On the Owner Information page, add the assertion that "Telephone" value in the Onner Information card is "6085552765"
    await expect(page.getByRole('row', { name: 'Telephone' }).getByRole('cell').last()).toHaveText(phoneNumber)

    //4. Add the assertion that Pet Name in the Owner Information card matches the name extracted from the page on the step 2
    await expect(page.locator('div.container.xd-container').locator('dd').first()).toContainText(petName!)
})

test('validate pets of the Madison city', async ({ page }) => {
    //On the Owners page, perform the assertion that Madison city has a list of pets: Leo, George, Mulligan, Freddy
    //wait for table load 
    await page.waitForSelector('table')

    const expectedPetsList = [' Freddy ', ' George ', ' Leo ', ' Mulligan ']
    let actualPetsList: string[] = []
    const rowsOfMadison = await page.getByRole('row', { name: 'Madison' })

    //use loop to iterate to extract pet names
    for (const row of await rowsOfMadison.all()) {
        const petsValue = await row.locator('td').nth(4).textContent() || ''
        actualPetsList.push(petsValue)
    }

    expect(actualPetsList.sort()).toEqual(expectedPetsList.sort())
})
test('validate specialty update', async ({ page }) => {
    //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByText("Veterinarians").click()
    await page.getByText('All').click()

    //2. On the Veterinarians page, add the assertion that "Rafael Ortega" has specialty "surgery"
    await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toHaveText('surgery')

    //3. Select the SPECIALTIES menu item in the navigation bar
    await page.getByRole('link', { name: 'Specialties' }).click()
    //4. Add assertion of the "Specialties" header displayed above the table
    await expect(page.locator("h2")).toHaveText("Specialties");

    //5. Click on "Edit" button for the "surgery" specialty
    await page.waitForSelector('tbody')

    const allRows = await page.locator('tbody tr').all()
    // Iterate through rows to find 'surgery'
    for (let row of allRows) {
        if (await row.locator('input').inputValue() === 'surgery') {
            // ... click 'Edit'
            await row.getByRole('button', { name: 'Edit' }).click()
            break;
        }
    }
    //6. Add assertion "Edit Specialty" page is displayed
    await expect(page.locator('h2')).toHaveText('Edit Specialty')
    //7. Update the specialty from "surgery" to "dermatology" and click "Update button"
    //8. Add assertion that "surgery" was changed to "dermatology" in the list of specialties
    const specialtyInput = page.locator('#name')
    await expect(specialtyInput).toHaveValue('surgery')
    await specialtyInput.clear()
    await specialtyInput.fill('dermatology')
    await page.getByText('Update').click()
    //9. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByText("Veterinarians").click()
    await page.getByText("All").click()
    //10. On the Veterinarians page, add assertion that "Rafael Ortega" has specialty "dermatology"
    await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toHaveText('dermatology')
    //11. Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"
    await page.getByRole('link', { name: 'Specialties' }).click()

    for (let row of allRows) {
        if (await row.locator('input').inputValue() === 'dermatology') {
            await row.getByRole('button', { name: 'Edit' }).click()
            break;
        }
    }

    await expect(specialtyInput).toHaveValue('dermatology')
    await specialtyInput.clear()
    await specialtyInput.fill('surgery')
    await page.getByText('Update').click()
})

test('validate specialty lists', async ({ page }) => {
    //1. Select the SPECIALTIES menu item in the navigation bar
    await page.getByText('Specialties').click()
    await page.waitForSelector('tbody')
    //2. On the Specialties page, select "Add" button. Type the new specialty "oncology" and click "Save" button
    await page.getByRole('button', { name: 'Add' }).click()
    await page.locator('#name').fill('oncology')
    await page.getByText('Save').click()
    await expect(page.locator('tbody tr').last().getByRole('textbox')).toHaveValue('oncology')
    //3. Extract all values of specialties and put them into the array.
    const allSpecialtyInputs = await page.locator('tbody tr').getByRole('textbox').all()
    const allSpecialties: string[] = []

    for (const input of allSpecialtyInputs) {
        allSpecialties.push(await input.inputValue())
    }

    //4. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByText('Veterinarians').click()
    await page.locator(".dropdown-menu").getByText(" All").click()
    //5. On the Veterinarians page, locate the "Sharon Jenkins" in the list and click "Edit" button
    await page.getByRole('row', { name: 'Sharon Jenkins' }).getByText('Edit Vet').click()
    //6. Click on the Specialties drop-down menu. Extract all values from the drop-down menu to an array
    await page.locator('.dropdown-display').click()
    //7. Add the assertion that array of specialties collected in the step 3 is equal the the array from drop-down menu
    const allValuesFromDropDownMenu = await page.locator(".dropdown-content label").allTextContents()
    expect(allSpecialties).toEqual(allValuesFromDropDownMenu)
    //8. Select the "oncology" specialty and click "Save vet" button
    await page.getByRole('checkbox', { name: 'oncology' }).check()
    await page.locator('.dropdown-display').click()
    await page.getByText('Save Vet').click()
    //9. On the Veterinarians page, add assertion, that "Sharon Jenkins" has specialty "oncology"
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toHaveText('oncology')
    //10. Navigate to SPECIALTIES page. Click "Delete" for "oncology" specialty
    await page.getByRole('link', { name: 'Specialties' }).click()
    await page.locator('tbody tr').last().getByRole('button', { name: "Delete" }).click()
    //11. Navigate to VETERINARIANS page. Add assertion that "Sharon Jenkins" has no specialty assigned
    await page.getByText('Veterinarians').click()
    await page.locator(".dropdown-menu").getByText(" All").click()
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toBeEmpty()
})

