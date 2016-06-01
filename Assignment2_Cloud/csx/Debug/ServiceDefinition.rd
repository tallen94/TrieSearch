<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="Assignment2_Cloud" generation="1" functional="0" release="0" Id="097a27fc-4f78-404b-af2d-0e3de5a206db" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="Assignment2_CloudGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="TrieSearch:Endpoint1" protocol="http">
          <inToChannel>
            <lBChannelMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/LB:TrieSearch:Endpoint1" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="TrieSearch:APPINSIGHTS_INSTRUMENTATIONKEY" defaultValue="">
          <maps>
            <mapMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/MapTrieSearch:APPINSIGHTS_INSTRUMENTATIONKEY" />
          </maps>
        </aCS>
        <aCS name="TrieSearch:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/MapTrieSearch:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="TrieSearchInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/MapTrieSearchInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:TrieSearch:Endpoint1">
          <toPorts>
            <inPortMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/TrieSearch/Endpoint1" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapTrieSearch:APPINSIGHTS_INSTRUMENTATIONKEY" kind="Identity">
          <setting>
            <aCSMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/TrieSearch/APPINSIGHTS_INSTRUMENTATIONKEY" />
          </setting>
        </map>
        <map name="MapTrieSearch:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/TrieSearch/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapTrieSearchInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/TrieSearchInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="TrieSearch" generation="1" functional="0" release="0" software="C:\Users\Trevor\Info344\SearchEngine\Assignment2_Cloud\csx\Debug\roles\TrieSearch" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaIISHost.exe " memIndex="-1" hostingEnvironment="frontendadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="Endpoint1" protocol="http" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="APPINSIGHTS_INSTRUMENTATIONKEY" defaultValue="" />
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;TrieSearch&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;TrieSearch&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/TrieSearchInstances" />
            <sCSPolicyUpdateDomainMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/TrieSearchUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/TrieSearchFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="TrieSearchUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="TrieSearchFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="TrieSearchInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="ad1ab738-ce97-4d39-a128-2f71bcce8ed5" ref="Microsoft.RedDog.Contract\ServiceContract\Assignment2_CloudContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="0c315926-af40-4c8a-8a2e-0aa8e4b2d056" ref="Microsoft.RedDog.Contract\Interface\TrieSearch:Endpoint1@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/Assignment2_Cloud/Assignment2_CloudGroup/TrieSearch:Endpoint1" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>