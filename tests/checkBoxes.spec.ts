import { test, expect } from '@playwright/test';
import { log } from 'console';
import exp from 'constants';
//1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
//2. Add assertion of the "Veterinarians" text displayed above the table with the list of Veterinarians

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Veterinarians').click()
    await page.getByText('All').click()
    await expect(page.getByRole("heading")).toHaveText("Veterinarians")
})

//3. Select the first veterinarian "Helen Leary" and click "Edit Vet" button
test('Validate selected specialities', async ({ page }) => {
    await page.getByText('Edit Vet').nth(1).click()
    //4. Add assertion of the "Specialties" field. The value "radiology" is displayed
    // Open the dropdown to make the option visible
    const expandDropdownForCheckboxes = await page.locator('.dropdown-display').click();

    // Wait for the dropdown content to be visible
    const waitForDropdownVisibility = await page.waitForSelector('.dropdown-content');

    // Optionally, check the dropdown content
    const dropdownContent = await page.locator('.dropdown-content');
    await expect(dropdownContent).toContainText('radiology');

    // Simulate checking the checkbox if needed
    //create const for checkboxes 
    const cardiologyCheckbox = await page.locator('#radiology')
    const dentistryCheckbox = await page.locator('#dentistry')
    const surgeryCheckbox = await page.locator('#surgery')
    await (cardiologyCheckbox).check();

    // Wait for the selected specialties element to be visible
    await page.waitForSelector('.selected-specialties');

    // Verify that 'radiology' is displayed in the selected specialties
    const selectedSpecialties = await page.locator('.selected-specialties');
    await expect(selectedSpecialties).toHaveText('radiology');

    //5. Click on the "Specialties" drop-down menu
    await expandDropdownForCheckboxes;

    //6. Add assertion that "radiology" specialty is checked
    expect(cardiologyCheckbox).toBeChecked()
    //7. Add assertion that "surgery" and "dentistry" specialties are unchecked
    expect(dentistryCheckbox).not.toBeChecked()
    expect(surgeryCheckbox).not.toBeChecked()

    //8. Check the "surgery" item specialty and uncheck the "cardiology" item speciality 
    await expandDropdownForCheckboxes;
    await waitForDropdownVisibility;
    await surgeryCheckbox.check()
    await cardiologyCheckbox.uncheck()

    //9. Add assertion of the "Specialties" field displayed value "surgery"
    await page.waitForSelector('.selected-specialties');
    await expect(selectedSpecialties).toHaveText('surgery');

    //10. Check the "dentistry" item specialty
    await expandDropdownForCheckboxes;
    await waitForDropdownVisibility;
    await dentistryCheckbox.check()

    //11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
    await expect(selectedSpecialties).toHaveText('surgery, dentistry');
})

test('Select all specialties', async ({ page }) => {
    //2. Select the third veterinarian "Rafael Ortega" and click "Edit Vet" button
    await page.getByText('Edit Vet').nth(3).click()

    //3. Add assertion that "Specialties" field is displayed value "surgery"
    await page.waitForSelector('.selected-specialties');
    const selectedSpecialties = await page.locator('.selected-specialties');
    await expect(selectedSpecialties).toHaveText('surgery');

    //4. Click on the "Specialties" drop-down menu
    await page.locator('.dropdown-display').click();

    //5. Check all specialties from the list
    //6. Add assertion that all specialties are checked
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
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
    //Valida two values 'dentistry, surgery' are displayed
    await expect(specialtiesField).toHaveText('dentistry, surgery')

    //4. Click on the "Specialties" drop-down menu
    await page.locator('.dropdown-display').click();

    //5. Uncheck all specialties from the list
    //6. Add assertion that all specialties are unchecked
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        expect(await box.isChecked()).toBeFalsy()
    }

    //7. Add assertion that "Specialties" field is empty
    // Asserts that the field has no text
    await expect(specialtiesField).toHaveText('')
})


