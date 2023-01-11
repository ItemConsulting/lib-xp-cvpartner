# CV-partner library for Enonic XP

## Usage

This library contains a task (`"cvpartner-import"`) that can be run in the main.ts of another application:
```typescript
run(
  {
    user: {
      idProvider: "system",
      login: "su",
    },
  },
  () => {
    submitTask({ descriptor: `${app.name}:cvpartner-import` });
  }
);
```

## Events

Events that can be emitted from this library:

- `custom.cvpartner.create`
- `custom.cvpartner.modify`

# Configuration

Add the following configuration to you *XP_HOME/config/com.mycompany.cfg*-file:

```ini
cvPartnerBaseUrl=https://<mycompany>.cvpartner.com
cvPartnerApiKey=<api key>
```

- `cvPartnerBaseUrl`, Base url to fetch data about cv-partner employee profiles. referenced `app.config.cvPartnerBaseUrl`
- `cvPartnerApiKey` key identifier used to authenticate request for endpoints such as `cvPartnerBaseUrl/{path}` + . referenced `app.config.cvPartnerApiKey`

### Building

To build the project run the following code

```bash
./gradlew build
```

### Deploy locally

Deploy locally for testing purposes:

```bash
./gradlew publishToMavenLocal
```
## Deploy to Jitpack

Go to the [Jitpack page for lib-xp-cvpartner](https://jitpack.io/#no.item/lib-xp-cvpartner) to deploy from GitHub (after
[creating a new versioned release](https://github.com/ItemConsulting/lib-xp-cvpartner/releases/new)).
