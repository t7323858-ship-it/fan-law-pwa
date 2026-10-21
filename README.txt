FAN LAW PWA v4

內容：
- index.html：主介面
- app.js：FAN LAW 計算、動態新增/刪除 PQ 點位與 CSV 匯出
- style.css：手機/桌面響應式介面
- manifest.webmanifest：PWA 安裝設定
- sw.js：離線快取
- icon.svg：應用程式圖示

安裝方式：
PWA 必須透過 HTTPS 網址或 localhost 提供，直接點開本機 index.html 不會啟用完整的安裝與離線功能。
1. 將整個資料夾部署到支援 HTTPS 的靜態網站主機（例如 GitHub Pages 或自有網站）。
2. 用手機瀏覽器開啟部署後的網址。
3. Android Chrome：選單 >「安裝應用程式」或「加到主畫面」。
4. iPhone Safari：分享 >「加入主畫面」。

計算說明：
Q2 = Q1 × (N2/N1)
P2 = P1 × (N2/N1)^2
L2 = L1 + 50 log10(N2/N1)
PQ 點位可自由新增或刪除（至少保留一點）。每一列均以該點測試轉速 N1 與可編輯的目標轉速 N2 計算：Q2 = Q1 × (N2/N1)，P2 = P1 × (N2/N1)^2，推算 N 為輸入的目標轉速。預設目標轉速是以第 5 點 4750 rpm 為基準，按各點原始轉速比例初始化；之後可逐列獨立修改。噪音基準預設為 57 dB(A) @ 4857 rpm，噪音目標轉速可獨立修改。

注意：相似律為估算，假設風扇幾何、空氣密度與條件相近；並不取代實測或完整系統曲線分析。

版本辨識：開啟 index.html 後，頁面最下方應看到「FAN LAW Calculator v4」。若沒有看到，表示你開到的不是這個新版資料夾。
