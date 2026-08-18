# GCC Campaign Hub - User Manual

Welcome to the **Global Connect Club (GCC) Campaign Hub**! This tool is designed to help you streamline outreach to alumni and students via WhatsApp and Email directly from your browser. 

The application is entirely client-side, meaning all your data stays on your computer and no external servers are used to process your messages.

---

## 📑 1. The Data Hub (Uploading Data)

The Data Hub is where you manage your audience lists.

### Uploading an Excel File
1. Open the application and ensure you are on the **Data Hub** tab.
2. Drag and drop your `.xlsx` or `.xls` file into the upload box, or click to browse your computer.
3. The system will process your file and display the data in a table.

### Mapping Columns
To send messages correctly, the app needs to know which columns in your Excel sheet correspond to essential fields (Name, Phone, Email, etc.).
1. Above the data table, you will see a section called **Column Mapping**.
2. Select the correct column name from your Excel sheet for each required field:
   - **Name**: The recipient's full name.
   - **Phone**: The recipient's WhatsApp number.
   - **Email**: The recipient's email address.
   - **SR No**: The serial number or row ID (optional).
3. The system usually auto-detects these, but you should verify they are correct.

### Managing Datasets
- You can upload multiple Excel files. Use the **dropdown menu in the top right corner** to switch between different lists (datasets).
- If you want to delete a list, select it from the dropdown and click the small **Trash Can** icon next to it.

---

## 📝 2. Template Studio

Once your data is loaded, switch to the **Dispatcher** tab. On the left side, you will see the Template Studio.

### Creating and Editing Templates
1. Type your message directly into the text box.
2. To create a new variation, click **+ New Template**. You can switch between templates using the tabs at the top of the editor.
3. You can rename a template by clicking on its name in the tab (e.g., changing "Template 1" to "Alumni Outreach 1").

### Injecting Variables (Mail Merge)
You can personalize every message using data from your Excel sheet.
1. Put your cursor exactly where you want to insert a variable in the text box.
2. Click one of the **+ColumnName** buttons above the text box.
3. The system will insert a tag like `{{StudentName}}`. When you send the message, this tag will automatically be replaced with the actual person's name from that row.

**Live Preview:** Look at the blue box at the bottom of the Template Studio to see exactly what the final message will look like for the first person on your list.

---

## 🚀 3. The Dispatcher (Sending Messages)

On the right side of the Dispatcher tab, you will see a grid of cards—one for every person in your Excel sheet.

### Sending a WhatsApp Message
1. Click the green **WhatsApp** button on a person's card.
2. A new tab will open directing you to WhatsApp Web (or your WhatsApp desktop app).
3. The chat will open with the personalized message pre-typed in the chat box.
4. Press **Send** in WhatsApp.

### Sending an Email
1. Click the blue **Email** button on a person's card.
2. A new tab will open directing you to Gmail.
3. The `To:` address, `Subject`, and personalized `Body` will all be completely filled out for you automatically.
4. Review the email and click **Send** in Gmail.

### Tracking Progress
- **Status Badges:** Once you click a dispatch button (WhatsApp or Email), the card will automatically be marked as **Sent** and turn green.
- **Progress Bar:** At the top of the Dispatcher, a progress bar tracks how many people you have contacted out of the total list.
- **Filtering:** Use the filter buttons (All, Pending, Sent) to hide people you've already contacted and focus only on the remaining ones.

### Duplicates & Touch Channels
- **Duplicates:** If the same phone number appears twice in your Excel sheet, the app will flag the second occurrence with an orange **Duplicate** tag. You can filter by duplicates to easily remove or skip them.
- **Touch Channels (Already Contacted):** If your Excel sheet has columns indicating whether someone was already contacted (e.g., "Touch 1 Channel"), the app will detect if that column has data. If it does, the card will be faded out and marked as **Contacted** so you don't accidentally message them again.

---

## ⚠️ Important Tips & Limitations

- **WhatsApp Rate Limits:** WhatsApp monitors accounts for spam. If you send too many messages too quickly to people who don't have you saved in their contacts, your account may get temporarily restricted. **Do not send messages too rapidly.** Take breaks between batches.
- **Local Storage:** Your data and templates are saved in your browser's local storage. This means if you refresh the page, your progress is safe. However, if you clear your browser data or use an Incognito window, your data will be erased.
- **Browser Pop-ups:** Ensure your browser is set to allow pop-ups for this website, as clicking WhatsApp or Email needs to open a new tab.
