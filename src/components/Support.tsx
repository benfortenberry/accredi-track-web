import { withAxios } from "../utils/AxiosInstance";
import GettingStarted from "../components/modals/GettingStarted";
const Support = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 ml-2">Support</h2>

<div className="pl-2">
<p>Pro users - make sure to add support@accreditrack.com to your safe senders llist to keep your notifcations from going to junk mail.</p>
  
  <br />
  <p>
        If you have any questions or need assistance, please contact us at{" "}
        <a
          href="mailto:support@accreditrack.com"
          className="text-blue-500 underline"
        >
          support@accreditrack.com
        </a>
        .
      </p>

      <br />
      <h3>The 3 videos below show how to get started:</h3>

      <div className="max-w-3xl pt-5">
        <GettingStarted auto={false} controls={true} />
      </div>

<br />
</div>


    
    </div>
  );
};

export default withAxios(Support);
