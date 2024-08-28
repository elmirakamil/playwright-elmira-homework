import { test, expect } from '@playwright/test';
//1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByText('Search').click()
})

test('select the desired date in the calendar', async ({ page }) => {
    //In the list of the Owners, locate the owner by the name "Harold Davis" and select this owner
    await page.getByRole('link', { name: 'Harold Davis' }).click()
    //3. On the Owner Information page, select "Add New Pet" button
    await page.getByRole('button', { name: 'Add New Pet' }).click()
    //4. In the Name field, type any new pet name, for example "Tom"
    const calenderIcon = page.locator('span.glyphicon.form-control-feedback').first()
    //assert the icon 'x'
    await expect(calenderIcon).toHaveClass(/glyphicon-remove/)
    await page.locator('#name').fill('Tom')
    //5. Add the assertion of icon in the input field the "checkmark" icon
    await expect(calenderIcon).toHaveClass(/glyphicon-ok/)
    //6. Click on the calendar icon for the "Birth Date" field
    await page.getByLabel('Open calendar').click()
    //7. Using calendar selector, select the date "May 2nd, 2014"
    const birthYear = '2014';
    const birthMonth = '05';
    const birthDay = '02';
    const dateToAssert = `${birthYear}/${birthMonth}/${birthDay}`
    await page.getByLabel('Choose month and year').click()
    await page.getByLabel('Previous 24 years').click()
    await page.getByRole('button', { name: birthYear }).click()
    await page.getByLabel(`${birthMonth} ${birthYear}`).click()
    await page.getByLabel(dateToAssert).click()
    await expect(page.locator('[name="birthDate"]')).toHaveValue(dateToAssert)
    //9. Select the type of pet "dog" and click "Save Pet" button
    await page.getByLabel('Type').selectOption('dog')
    await page.getByRole('button', { name: 'Save Pet' }).click()
    //10. On the Owner Information page, add assertions for the newly created pet. Name is Tom, Birth Date is in the format "2014-05-02", Type is dog
    const petField = page.locator('td', { has: page.getByText('Tom') })
    await expect(petField.locator('dd').first()).toHaveText('Tom')
    await expect(petField.locator('dd').nth(1)).toHaveText(`${birthYear}-${birthMonth}-${birthDay}`)
    await expect(petField.locator('dd').nth(2)).toHaveText('dog')
    //11. Click "Delete Pet" button the for the new pet "Tom"
    await page.getByRole('button', { name: 'Delete Pet' }).last().click()
    //12. Add assertion that Tom does not exist in the list of pets anymore
    await expect(petField).toHaveCount(0)
})
test('select the desired date in the calendar part II', async ({ page }) => {
    // 2. In the list of the Owners, locate the owner by the name "Jean Coleman" and select this owner
    await page.getByRole('link', { name: 'Jean Coleman' }).click()
    //3. In the list of pets, locate the pet with a name "Samantha" and click "Add Visit" button
    const petsAndVisitsRowOfSamatha = page.locator('app-pet-list', { hasText: 'Samantha' })
    await petsAndVisitsRowOfSamatha.getByText('Add Visit').click()
    //4. Add the assertion that "New Visit" is displayed as header of the page
    await expect(page.getByRole("heading")).toHaveText("New Visit")
    //5. Add the assertion that pet name is "Samantha" and owner name is "Jean Coleman"
    await expect(page.locator('tr', { hasText: 'Samantha' })).toContainText('Jean Coleman')
    //6. Click on the calendar icon and select the current date in date picker
    await page.getByLabel('Open calendar').click()
    await page.locator('span.mat-calendar-body-today').click()
    //7. Add assertion that date is displayed in the format "YYYY/MM/DD"
    const date = new Date()
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: '2-digit' })
    const day = date.toLocaleString('en-US', { day: '2-digit' })
    const currentDateFormatted = `${year}-${month}-${day}`
    await expect(page.locator('.mat-datepicker-input')).toHaveValue(`${year}/${month}/${day}`)

    //8. Type the description in the field, for example, "dermatologists visit" and click "Add Visit" button
    await page.locator('#description').fill('dermatology visit')
    await page.getByRole('button', { name: 'Add Visit' }).click()

    //9. Add assertion that selected date of visit is displayed at the top of the list of visits 
    //for "Samantha" pet on the "Owner Information" page and is in the format "YYYY-MM-DD"
    await expect(petsAndVisitsRowOfSamatha.locator('app-visit-list tr td').first()).toHaveText(currentDateFormatted)

    //10. Add one more visit for "Samantha" pet by clicking "Add Visit" button
    await petsAndVisitsRowOfSamatha.getByText('Add Visit').click()
    //11. Click on the calendar icon and select the date which is 45 days back from the current date
    await page.locator('.mdc-icon-button').click()
    date.setDate(date.getDate() - 45)
    // Get the year, month, and day for the massage appointment
    const previousAppointmentYear = date.getFullYear();
    const previousAppointmentMonth = date.toLocaleString('en-US', { month: '2-digit' })
    const previousAppointmentDayNumeric = date.toLocaleString('en-US', { day: 'numeric' })
    const previousAppointmentDay2Digit = date.toLocaleString('en-US', { day: '2-digit' })
    // Format the expected appointment date as 'YYYY-MM-DD'
    const expectedMassageAppointmentDate = `${previousAppointmentYear}-${previousAppointmentMonth}-${previousAppointmentDay2Digit}`;
    // Navigate the calendar to the correct month and year
    let calendarMonthAndYear = await page.locator('.mat-calendar-period-button').textContent()
    while (!calendarMonthAndYear?.includes(`${previousAppointmentMonth} ${previousAppointmentYear}`)) {
        await page.locator('.mat-calendar-previous-button').click()
        calendarMonthAndYear = await page.locator('.mat-calendar-period-button').textContent()
    }
    // Select the day on the calendar
    await page.getByText(previousAppointmentDayNumeric, { exact: true }).click()
    //12. Type the description in the field, for example, "massage therapy" and click "Add Visit" button
    await page.locator('#description').fill('massage therapy')
    await page.getByText('Add Visit').click()

    //13. Add the assertion, that date added at step 11 is in chronological order in relation
    // to the previous dates for "Samantha" pet on the "Owner Information" page.
    // The date of visit above this date in the table should be greater.
    const petAllAppointments = petsAndVisitsRowOfSamatha.locator('app-visit-list tr')
    const laterAppointmentDateforSamathasPet = await petAllAppointments.nth(1).locator('td').first().textContent()
    const currentAppointmentDateforSamathasPet = await petAllAppointments.nth(2).locator('td').first().textContent()
    expect(Date.parse(currentAppointmentDateforSamathasPet!) < Date.parse(laterAppointmentDateforSamathasPet!)).toBeTruthy()
    //14. Select the "Delete Visit" button for both newly created visits
    await petsAndVisitsRowOfSamatha.locator('app-visit-list tr', { hasText: currentDateFormatted }).getByText('Delete Visit').click()
    await petsAndVisitsRowOfSamatha.locator('app-visit-list tr', { hasText: expectedMassageAppointmentDate }).getByText('Delete Visit').click()
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/visits/*")
    //15. Add the assertion that deleted visits are no longer displayed in the table on "Owner Information" page
    for (const row of await petAllAppointments.all()) {
        expect(await row.textContent()).not.toContain(currentDateFormatted)
        expect(await row.textContent()).not.toContain(expectedMassageAppointmentDate)
    }
})