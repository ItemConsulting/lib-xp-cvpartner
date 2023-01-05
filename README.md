# CV-partner library for Enonic XP

# This application is run in the main.ts of another application:
```
run(
  {
    user: {
      idProvider: "system",
      login: "su",
      },
  },
  () => {
    submitTask( { descriptor: "no.niva.www:cvpartner-import" });  
  }    
);
```

# Events that can be emitted from this library:
- custom.cvpartner.create
- custom.cvpartner.modify

# Configuration variables typically stored in ~/.enonic/sandboxes/{sandbox}/home/config :
- cvPartnerEmployeeUrl, Endpoint for which to fetch data about cv-partner employee profiles. referenced app.config.cvPartnerEmployeeUrl
- cvPartnerApiKey key identifier used to authenticate request for endpoints such as cvPartnerEmployeeUrl. referenced app.config.cvPartnerApiKey
              
