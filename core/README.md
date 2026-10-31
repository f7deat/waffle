Language : English | [Tiếng Việt](./README.md)

<h1 align="center">Waffle</h1>

- Front-end: https://github.com/f7deat/cms

## 📦 Development

GIT:

```bash
$ git clone https://github.com/f7deat/waffle.git
```

FE:

```bash
$ cd ClientApp
$ npm i
$ npm run build
```

BE:

```bash
$ dotnet build
$ dotnet ef migrations add InitialCreate
$ dotnet ef database update
```

Learn more about Migration: https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/

Open your browser and visit http://localhost:8000

## Wallet payments

Wallet deposits use PayOS. Configure these server-side settings through environment variables or another secret store; do not commit provider credentials:

```text
PayOS__ClientId
PayOS__ApiKey
PayOS__ChecksumKey
PayOS__FrontendBaseUrl
```

`PayOS__FrontendBaseUrl` must be the HTTPS origin of the web app. Register `https://<api-host>/api/wallet/payos/webhook` as the PayOS webhook URL. Apply database migrations before enabling wallet operations.

Withdrawal account numbers are encrypted with ASP.NET Core Data Protection. In production, set `DataProtection__KeyRingPath` to a durable directory shared by all API instances, restrict access to the application identity, and protect the key ring at rest. Back it up with the database: losing the keys makes stored withdrawal account numbers unreadable. Without this setting, the application logs a warning and uses the platform's default key storage.

For local development only, an HTTP frontend URL can be allowed by setting `PayOS__AllowInsecureFrontendUrl=true` in the Development environment.

## 🚀 Deployment

web.config: allow cors
```
</system.webServer>
    ...
    <security>
        <requestFiltering>
          <verbs>
            <remove verb="OPTIONS" />
            <add verb="OPTIONS" allowed="true" />
          </verbs>
        </requestFiltering>
      </security>
</system.webServer>
```

## 🔨 Usage

`waffle` is available supported in live server: https://cms.defzone.net

## 📝 Docs

Read document:

| # | Name | URL                                 |
|---|------|-------------------------------------|
| 1 | API  | https://waffleverse.gitbook.io/api/ |