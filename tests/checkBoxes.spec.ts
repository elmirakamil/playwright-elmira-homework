import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    //1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.goto('/')
    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()
})

test('Validate selected specialities', async ({ page }) => {
    //2. Add assertion of the "Veterinarians" text displayed above the table with the list of Veterinarians
    await expect(page.getByRole("heading")).toHaveText("Veterinarians")

    //3. Select the first veterinarian "Helen Leary" and click "Edit Vet" button
    //Clicks seconds vet from the list
    await page.getByText('Edit Vet').nth(1).click()

    //4. Add assertion of the "Specialties" field. The value "radiology" is displayed
    // Verify that 'radiology' is displayed in the selected specialties
    const specialtiesField = page.locator('.selected-specialties')
    await expect(specialtiesField).toContainText('radiology')

    //5. Click on the "Specialties" drop-down menu
    await specialtiesField.click()

    //6. Add assertion that "radiology" specialty is checked
    // create const for values in checkbox
    const radiologyCheckboxLocator = page.locator('#radiology')
    const dentistryCheckboxLocator = page.locator('#dentistry')
    const surgeryCheckboxLocator = page.locator('#surgery')
    expect(radiologyCheckboxLocator).toBeChecked()
    //7. Add assertion that "surgery" and "dentistry" specialties are unchecked
    expect(dentistryCheckboxLocator).not.toBeChecked()
    expect(dentistryCheckboxLocator).not.toBeChecked()

    //8. Check the "surgery" item specialty and uncheck the "cardiology" item speciality 
    await surgeryCheckboxLocator.check()
    await radiologyCheckboxLocator.uncheck()

    //9. Add assertion of the "Specialties" field displayed value "surgery"
    await expect(specialtiesField).toHaveText('surgery');

    //10. Check the "dentistry" item specialty
    await dentistryCheckboxLocator.check()

    //11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
    await expect(specialtiesField).toHaveText('surgery, dentistry');
})

test('Select all specialties', async ({ page }) => {
    //2. Select the third veterinarian "Rafael Ortega" and click "Edit Vet" button
    await page.getByText('Edit Vet').nth(3).click()

    //3. Add assertion that "Specialties" field is displayed value "surgery"
    const selectedSpecialties = page.locator('.selected-specialties');
    await expect(selectedSpecialties).toHaveText('surgery');

    //4. Click on the "Specialties" drop-down menu
    await page.locator('.dropdown-display').click();

    //5. Check all specialties from the list
    //6. Add assertion that all specialties are checked
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check()
        expect(await box.isChecked()).toBeTruthy()
    }

    //7. Add assertion that all checked specialities are displayed in the "Specialties" field
    await expect(selectedSpecialties).toHaveText('surgery, radiology, dentistry');
})
test('Unselect all specialties', async ({ page }) => {
    //2. Select the third veterinarian "Linda Douglas" and click "Edit Vet" button
    //Linda is 3rd vet on the list
    await page.getByText('Edit Vet').nth(2).click()

    //3. Add assertion of the "Specialties" field displayed value "surgery, dentistry"
    const specialtiesField = page.locator('.selected-specialties')
    //Validate two values 'dentistry, surgery' are displayed
    await expect(specialtiesField).toHaveText('dentistry, surgery')

    //4. Click on the "Specialties" drop-down menu
    await page.locator('.dropdown-display').click();

    //5. Uncheck all specialties from the list
    //6. Add assertion that all specialties are unchecked
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.uncheck()
        expect(await box.isChecked()).toBeFalsy()
    }

    //7. Add assertion that "Specialties" field is empty
    // Asserts that the field has no text
    await expect(page.locator('div span.selected-specialties')).toBeEmpty()
})


