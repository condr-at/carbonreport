# Dataset Table - Quick Start Guide

## 🚀 Access the Dataset Table

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to any project's dataset page:
   ```
   http://localhost:3001/projects/{project-id}/dataset
   ```

3. Or use the navigation:
   - Go to Dashboard → Projects
   - Click on a project
   - Click "Dataset" tab in the sidebar

## 📊 Features Overview

### Viewing Data

The dataset table displays all your project data in one unified view:

- **Grouped by category**: Product, Materials, Energy, Transport, etc.
- **Color-coded backgrounds**: Each group has a distinct color for easy scanning
- **Icons**: Visual indicators for each group (📦 Product, 🔩 Materials, etc.)
- **Singleton vs Repeatable**: 
  - Singleton fields show "-" in Item column (one value per project)
  - Repeatable fields show item numbers (1, 2, 3...) for tabular data

### Editing Values

**To edit a field value:**
1. Click on any value cell
2. Type your new value
3. Press Enter or click outside to save
4. Press Escape to cancel

**Auto-save:** Changes are saved automatically when you blur the cell or press Enter.

**Validation:** The system validates based on field type (text, number, date, etc.)

### Adding Repeatable Items

For groups with repeatable data (Materials, Transport, etc.):

1. Scroll to the bottom of the group
2. Click the **[+ Add {Group} Item]** button
3. New empty row(s) appear
4. Fill in the values

**Example:** Adding a new material creates entries for Material Name, Amount, Unit, etc.

### Deleting Items

**To delete a repeatable item:**
1. Click the **[🗑️]** button next to any field in that item
2. Confirm the deletion
3. All fields for that item are removed

**Note:** You cannot delete singleton fields (they're part of the fixed schema)

### Requesting Data

**To request data from a contact:**
1. Click the **[📧]** button next to any field
2. Enter contact email and name
3. Review the email preview
4. Click "Open Email Client"
5. Your default email app opens with pre-filled template
6. Send the email to your contact

**Templates include:**
- Project name
- Field label(s)
- Professional request message

### Search & Filter

**Search:**
- Use the search bar at the top to find specific fields or values
- Searches across field names, values, and group names
- Updates in real-time

**Filter by Group:**
- Use the dropdown to show only specific categories
- Options: All Groups, Product, Materials, Energy, etc.
- Useful for focusing on one aspect of the data

## 💡 Tips & Best Practices

### Data Organization

1. **Start with Product Info**: Fill in basic product details first
2. **Add Materials**: Use "Add Item" for each material component
3. **Track Energy**: Record consumption data for calculations
4. **Document Transport**: Add transport legs with distances
5. **Review Regularly**: Use search to find incomplete fields

### Efficiency Tips

1. **Use Search**: Find fields quickly instead of scrolling
2. **Group Filter**: Focus on one category at a time
3. **Inline Editing**: No need to open separate forms
4. **Request Early**: Send data requests to contacts as soon as you identify gaps

### Keyboard Shortcuts

- **Enter**: Save and move to next row
- **Escape**: Cancel edit
- **Tab**: Move between fields (standard browser behavior)

## 🔄 Data Synchronization

The dataset uses **optimistic locking** to prevent conflicts:

- Each change increments a version number
- If someone else edits while you're working, you'll see a conflict warning
- Refresh the page to see the latest data

## 📧 Email Templates

When you request data, the system generates professional emails:

**Subject:** Data Request for {Project Name} - {Field/Group}

**Body includes:**
- Greeting with contact name
- Project context
- Specific fields needed
- Professional sign-off

You can customize the message before sending from your email client.

## ⚠️ Important Notes

### What You CAN Do
✅ Edit any value inline
✅ Add new repeatable items
✅ Delete repeatable items
✅ Search and filter data
✅ Request data via email

### What You CANNOT Do (Yet)
❌ Delete singleton fields (by design - they're part of the schema)
❌ Reorder items by drag-and-drop (coming soon)
❌ Import from CSV (coming soon)
❌ Add completely custom fields (use template fields)

## 🐛 Troubleshooting

### Changes not saving?
- Check your internet connection
- Look for error messages in the UI
- Refresh the page and try again

### Can't delete an item?
- Make sure it's a repeatable field (has an item number)
- Singleton fields cannot be deleted

### Email not opening?
- Ensure you have a default email client configured
- Check if pop-ups are blocked in your browser
- Copy the generated email text manually if needed

### Data looks wrong?
- Refresh the page to ensure you have the latest version
- Check if someone else made concurrent edits
- Verify you're viewing the correct project

## 📚 Related Documentation

- [DATASET_TABLE_REQUIREMENTS.md](./DATASET_TABLE_REQUIREMENTS.md) - Complete specification
- [ITERATION_6_SUMMARY.md](./ITERATION_6_SUMMARY.md) - Implementation details
- [API_REFERENCE.md](./API_REFERENCE.md) - API endpoints
- [Requirements v0.0.1.md](./Requirements%20v0.0.1.md) - Data model

## 🆘 Need Help?

If you encounter issues or have questions:
1. Check this guide first
2. Review the error message carefully
3. Refresh the page to ensure you have the latest data
4. Check the browser console for technical errors
5. Refer to the full documentation linked above

---

**Pro Tip:** The dataset table is designed to feel like a spreadsheet - click, edit, and save. No complex forms or dialogs needed for most operations!
