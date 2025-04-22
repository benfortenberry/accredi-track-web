import logo from "../assets/logo_white2.png";

function ComingSoon() {

 

  return (
    <div className="flex bg-gradient flex-col items-center justify-center min-h-screen bg-white">
      <header className="w-full  text-white py-12 text-center">

        <div className="fade-in">
          <img
            src={logo}
            alt="AccrediTrack Logo"
            className="w-32 mx-auto mb-4"
          />
          <h1 className="text-5xl font-bold mb-4"> AccrediTrack</h1>
          <p className="text-lg mb-6">
          Coming Soon: A better way to manage compliance.
          </p>
        </div>
      </header>

  

    

   

     
    </div>
  );
}

export default ComingSoon;
