import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import '../global.css';
import Image from 'next/image';

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
    <body style={{height:'100vh'}}>
    <main style={{height:'inherit'}}>
      <section style={{height:'inherit'}} className="auth-background-image">
        <div style={{height:'inherit'}} className="px-120 py-200 flex items-center ">
          <div className="row full-width">
            <div className="col-4 flex column justify-center">
              <Image className="mb-3" height={35} width={70} src="/KYPwhiteIcon.png" alt="KYPwhiteIcon" />
              <p className="text-ffffff text-16 text-weight-400" style={{width:'380px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            </div>
            <div className="col-8 flex justify-end">
              {children}
            </div>
          </div>
        </div>

      </section>
    </main>
    </body>
    </html>
  );
}
