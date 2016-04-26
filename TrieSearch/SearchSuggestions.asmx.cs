using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace TrieSearch {
    /// <summary>
    /// Summary description for SearchSuggestions
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class SearchSuggestions : System.Web.Services.WebService {

        public static TrieTree tree;
        public static string LocalDiskDir = System.IO.Path.GetTempPath() + "\\titles.txt";

        [WebMethod]
        public string BuildTrie() {
            tree = new TrieTree();
            StreamReader reader = new StreamReader(LocalDiskDir);
            PerformanceCounter memProcess = new PerformanceCounter("Memory", "Available MBytes");
            float memUsage = memProcess.NextValue();
            string word = reader.ReadLine();
            int i = 0;
            while(word != null && memUsage > 100) {
                tree.AddWord(word);
                if(i++ % 10000 == 0) {
                    memUsage = memProcess.NextValue();
                } 
                word = reader.ReadLine();
            }
            reader.Dispose();
            return word;
        }

        [WebMethod]
        public List<string> GetSuggestions(String s) {
            return tree.GetSuggestions(s.ToLower());
        }

        [WebMethod]
        public bool DownloadWiki() {
            CloudStorageAccount acct = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["StorageConnectionString"]);
            CloudBlobClient blobClient = acct.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference("assignment2blob");
            if (container.Exists() && !File.Exists(LocalDiskDir)) {
                CloudBlob blob = container.GetBlobReference("titles.txt");
                blob.DownloadToFile(LocalDiskDir, FileMode.Create);
            }
            return File.Exists(LocalDiskDir);
        }
    }
}
