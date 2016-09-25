using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
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

        public static TrieGraph tree;
        public static string LocalDiskDir = System.IO.Path.GetTempPath() + "\\titles.txt";

        [WebMethod]
        public List<string> GetSuggestions(string s) {
            return tree.GetSuggestions(s.ToLower());
        }

        [WebMethod]
        public string BuildTrie() {
            tree = new TrieGraph();
            Regex r = new Regex(@"^[a-zA-Z ]*$");
            if (!File.Exists(LocalDiskDir)) {
                DownloadWiki();
            }
            string lastLine = "";
            using (StreamReader reader = new StreamReader(LocalDiskDir)) {
                string line = reader.ReadLine();
                int i = 0;
                PerformanceCounter memCounter = new PerformanceCounter("Memory", "Available MBytes");
                float availableMem = memCounter.NextValue();
                while (line != null && availableMem > 100) {
                    if (r.IsMatch(line)) {
                        tree.AddTitle(line.ToLower());
                        i++;
                        if (i % 10000 == 0) {
                            availableMem = memCounter.NextValue();
                        }
                        lastLine = line.ToLower();
                    }
                    line = reader.ReadLine();
                }
            }
            return lastLine + " | " + tree.NumTitles();
        }
        
        public bool DownloadWiki() {
            CloudStorageAccount acct = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["StorageConnectionString"]);
            CloudBlobClient blobClient = acct.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference("wiki");
            if (container.Exists() && !File.Exists(LocalDiskDir)) {
                CloudBlob blob = container.GetBlobReference("titles.txt");
                blob.DownloadToFile(LocalDiskDir, FileMode.Create);
            }
            return File.Exists(LocalDiskDir);
        }
    }
}
