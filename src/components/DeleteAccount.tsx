
const DeleteAccount = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">How to Delete Your Account</h1>
      <div className="max-w-3xl text-left">
        <ol className="list-decimal pl-6 mb-6">
          <li className="mb-4">
            <strong>Log In:</strong> Ensure you are logged into your account.
          </li>
          <li className="mb-4">
            <strong>Navigate to Settings:</strong> Go to the <strong>Settings</strong> page by clicking on your profile or the settings icon in the navigation menu.
          </li>
          <li className="mb-4">
            <strong>Locate the Delete Account Option:</strong> Scroll down to the <strong>Account Management</strong> section and click on the <strong>Delete Account</strong> button.
          </li>
          <li className="mb-4">
            <strong>Confirm Deletion:</strong> A confirmation dialog will appear. Carefully read the message. If you are sure, confirm the deletion by clicking <strong>Yes, Delete My Account</strong>.
          </li>
          <li className="mb-4">
            <strong>Data Retention:</strong> After confirming, your account and associated data will be permanently deleted within 30 days. If you have a PRO subscription, you will have 30 days to download your data before it is permanently deleted.
          </li>
          <li className="mb-4">
            <strong>Need Help?</strong> If you encounter any issues, please contact our support team at:{" "}
            <a href="mailto:support@accreditrack.com" className="text-blue-500 underline">
              support@accreditrack.com
            </a>.
          </li>
        </ol>

        <div className=" mb-6">
          <strong>Notes:</strong>
          <ul className="list-disc pl-6">
            <li>Deleting your account is permanent and cannot be undone.</li>
            <li>Ensure you cancel any active subscriptions before deleting your account.</li>
          </ul>
        </div>

   
      </div>
    </div>
  );
};

export default DeleteAccount;