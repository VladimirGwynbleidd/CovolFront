FROM registry.access.redhat.com/dotnet/dotnet-22-rhel7:latest AS base
ENV PATH=/opt/rh/rh-nodejs10/root/usr/bin:/opt/rh/rh-dotnet22/root/usr/bin:/opt/rh/rh-dotnet22/root/usr/sbin:/opt/app-root/.dotnet/tools:${PATH}
COPY --chown=1001:0 . /opt/app-root/src/
WORKDIR /opt/app-root/src
EXPOSE 8080

FROM base AS build
RUN ls -l
#WORKDIR /src
#COPY ["Covol/Covol.csproj", "Covol/"]
RUN dotnet restore "Covol.csproj"
#COPY . .
#WORKDIR "/src/Covol"
RUN dotnet build "Covol.csproj" -c Release -o /opt/app-root/app

FROM build AS publish
RUN dotnet publish "Covol.csproj" -c Release -o /opt/app-root/app

FROM base AS final
WORKDIR /opt/app-root/app
COPY --from=publish --chown=1001:0 /opt/app-root/app .
ENTRYPOINT ["dotnet", "Covol.dll"]