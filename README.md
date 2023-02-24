# CV-partner library for Enonic XP

This library is an integration to Enonic XP application code for persons, referred to as employees, registered in CV-partner. This enables the ability to import employees and their profiles in CV-partner into `Enonic XP node library` and create content for these respectively. This library _create and send events_ which operate on new and modified data from CV-partners user APIs.

[![](https://jitpack.io/v/no.item/lib-xp-cvpartner.svg)](https://jitpack.io/#no.item/lib-xp-cvpartner)

<img src="https://github.com/ItemConsulting/lib-xp-cvpartner/raw/main/docs/icon.svg?sanitize=true" width="150">

## Installation

To install this library you need to add a new dependency to your app's build.gradle file.

### Gradle

```groovy
repositories {
  maven { url 'https://jitpack.io' }
}

dependencies {
  include "no.item:lib-xp-cvpartner:0.1.0"
}
```

### TypeScript

To update the version of *enonic-types* in *package.json* using npm, run the following command:
```bash
npm install --save-dev @item-enonic-types/lib-cvpartner
```

## Usage

*This library contains a task (`"cvpartner-import"`) that can be run in the main.ts of another application:*
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

*You can select an employee in your Enonic XP application code with a `CustomSelector`:*
```xml
<input name="cvPartnerEmployeeId" type="CustomSelector">
    <label i18n="employee.cvPartnerEmployeeId">Profile from CV-Partner</label>
    <occurrences minimum="0" maximum="1"/>
    <config>
        <service>cv-partner-employee</service>
    </config>
</input>
```

*In Enonic XP you may listen to the events emitted from this library by defining a `listener: *
```typescript
listener<CVPartnerEmployeeNode & Node>({
  type: "custom.cvpartner.*",
  callback: (event) => {
    // Handle event
  },
});
```

## Events

Events that can be emitted from this library:

- `custom.cvpartner.create`
- `custom.cvpartner.modify`
- `custom.cvpartner.image`

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
