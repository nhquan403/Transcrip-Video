window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mỗi lời gọi Claude phần lớn thời gian chỉ là <strong>chờ mạng</strong>. Code chặn (blocking) thì đứng im trong lúc chờ đó.
<strong>Async/await</strong> cho phép chương trình đi làm việc khác trong lúc response còn đang bay, rồi quay lại đúng chỗ khi có kết quả.
Async cho bạn <strong>concurrency</strong> trên một thread, <strong>không phải</strong> chạy song song thật.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Blocking (chặn):</strong> gọi xong thì đứng chờ trọn câu trả lời rồi mới chạy dòng tiếp theo.</li>
  <li><strong>Coroutine:</strong> hàm viết với <code>async</code>, có thể tạm dừng giữa chừng, trả quyền điều khiển, rồi chạy tiếp đúng chỗ đã dừng.</li>
  <li><strong>Event loop:</strong> bộ điều phối chạy các coroutine; coroutine nào đang chờ mạng thì nó chuyển sang cái khác đang sẵn sàng.</li>
  <li><strong>await:</strong> từ khóa tạm dừng coroutine cho tới khi thứ nó chờ sẵn sàng, mà không chặn cả thread.</li>
  <li><strong>I/O bound:</strong> việc tốn thời gian vào chờ vào/ra (mạng, đĩa), không phải tính toán CPU.</li>
</ul>

<h3>Chặn và không chặn</h3>
<ul>
  <li><strong>Lời gọi chặn</strong> là mặc định trong phần lớn code: gọi Claude và chương trình dừng ngay đó, chờ trọn response. Một lời gọi thì ổn,
  nhưng một lời gọi chậm làm đông cứng mọi thứ phía sau, và 50 lời gọi sẽ chạy lần lượt từng cái.</li>
  <li><strong>Lời gọi không chặn</strong>: bạn phát request và <code>await</code> nó, tức bảo runtime "đi làm việc có ích khác trong lúc response còn đang bay". Người gọi không bao giờ ngồi không.</li>
</ul>
<p>Chuyển từ <strong>chờ</strong> sang <strong>nhường</strong> là nền tảng của cả bài.</p>

<h3>Vì sao lời gọi Claude rất hợp với async?</h3>
<div class="box">🍳 <strong>Hình dung thế này:</strong> Một đầu bếp nấu năm món. Nồi canh cần ninh 20 phút. Đầu bếp "chặn" đứng nhìn nồi canh 20 phút rồi mới thái rau.
Đầu bếp "async" đặt nồi lên bếp, đi thái rau, rán cá, và chỉ quay lại khi nồi canh sôi. <strong>Vẫn chỉ một người</strong>, nhưng thời gian chờ không bị phí.</div>
<p>Một request tới API là <strong>I/O bound</strong>: gần như toàn bộ thời gian là chờ mạng, không đốt CPU. Trên dòng thời gian, phần code chuẩn bị request chỉ là một lát mỏng,
còn lại là một quãng dài chờ byte quay về. Async trao quãng chờ đó cho việc khác, <strong>không cần tạo thêm thread</strong>.
Càng nhiều lời gọi đang bay, càng lấy lại được nhiều thời gian chết.</p>

<h3>Điều gì xảy ra khi await?</h3>
<ol>
  <li>Coroutine của bạn <strong>tạm dừng</strong> ngay tại await.</li>
  <li>Quyền điều khiển trở về <strong>event loop</strong>.</li>
  <li>Loop tìm coroutine khác đang sẵn sàng và chạy nó.</li>
  <li>Coroutine đang dừng nằm đó, <strong>không tốn gì</strong>, chờ response.</li>
  <li>Kết quả về tới là loop <strong>đánh thức</strong> nó, và nó chạy tiếp ngay sau await với kết quả trong tay.</li>
</ol>
<p>Không có gì quay vòng bận rộn, không có gì liên tục hỏi "xong chưa". Loop đánh thức bạn đúng lúc, không sớm hơn.</p>

<h3>Hai hiểu lầm phổ biến</h3>
<ul>
  <li><strong>"Async là song song":</strong> sai. Trên một thread, async <strong>xen kẽ</strong> các task, chuyển qua lại ở các điểm await,
  nhưng tại một thời điểm chỉ một task thật sự chạy. Công việc chồng lên nhau theo thời gian, không chạy cùng lúc trên nhiều nhân CPU.</li>
  <li><strong>"Await là chặn":</strong> ngược lại. Điểm await chính là chỗ code <strong>nhường</strong> để loop chạy việc khác.
  Một hàm không có await nào thì không bao giờ cho loop cơ hội chuyển. Await không chặn bạn; nó là thứ <strong>giúp bạn không bị chặn</strong>.</li>
</ul>

<h3>Một lời gọi async từ đầu tới cuối</h3>
<ol>
  <li>Gọi phiên bản async của hàm client: bạn nhận <strong>ngay</strong> một coroutine, một lời hứa về việc sẽ làm, chưa phải response.</li>
  <li>Await coroutine đó: event loop "đỗ" task của bạn lại và đi chạy việc khác.</li>
  <li>Response về qua mạng: loop đánh thức task, code chạy tiếp với kết quả thật.</li>
</ol>

<h3>Concurrency, parallelism và async</h3>
<ul>
  <li><strong>Concurrency</strong> là chuyện <strong>cấu trúc</strong>: nhiều task cùng đang dở dang, thay phiên nhau, dù chỉ một thread làm việc.</li>
  <li><strong>Parallelism</strong> mạnh hơn: các task <strong>thật sự chạy cùng một thời điểm</strong>, cần nhiều nhân hoặc nhiều máy.</li>
  <li><strong>Async</strong> là một cách cụ thể để có concurrency: dùng event loop và await để xen kẽ task trên một thread, thay vì mỗi task một thread.</li>
</ul>
<p>Async cho concurrency, nhưng không nhất thiết cho parallelism. Phân biệt rõ điều này giải thích được nhiều hiện tượng hiệu năng khó hiểu.</p>

<h3>Ba cái bẫy làm mất tác dụng của async</h3>
<ul>
  <li><strong>Gọi thư viện chặn bên trong coroutine:</strong> lời gọi không nhường thì làm đứng cả event loop, mọi task khác đông cứng theo.</li>
  <li><strong>Quên await:</strong> gọi hàm async mà không await coroutine nó trả về thì việc đó <strong>lặng lẽ không bao giờ chạy</strong>. Không lỗi, không kết quả.</li>
  <li><strong>Tính toán CPU nặng trên loop:</strong> một phép tính dài không có await chặn mọi thứ, vì loop không thể chuyển giữa chừng.</li>
</ul>
<p>Chủ đề chung: giữ event loop rảnh để làm đúng một việc nó giỏi nhất, là <strong>chờ mạng</strong>.</p>
<p>💡 Trong Java (bài tập của bạn), không có từ khóa async/await; <code>CompletableFuture</code> đóng vai "lời hứa", còn <code>join()</code> là chỗ chờ kết quả.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Lời gọi API là I/O bound: phần lớn thời gian là chờ, và async lấy lại thời gian đó.</li>
  <li>Await là chỗ nhường, không phải chỗ chặn; quên await là việc không bao giờ chạy.</li>
  <li>Async cho concurrency trên một thread, không phải parallelism thật.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">sits doing nothing while the response travels</em>: ngồi không trong lúc response đang trên đường về.</li>
  <li><em class="en">frees the caller</em>: giải phóng người gọi.</li>
  <li><em class="en">while the response is still in flight</em>: trong lúc response vẫn đang bay.</li>
  <li><em class="en">That single shift from waiting to yielding</em>: một bước chuyển từ chờ sang nhường.</li>
  <li><em class="en">Once those three click</em>: một khi ba thứ đó "vào".</li>
  <li><em class="en">burning CPU</em>: đốt CPU.</li>
  <li><em class="en">a tiny sliver</em>: một lát mỏng.</li>
  <li><em class="en">dead time</em>: thời gian chết.</li>
  <li><em class="en">Nothing is spinning in a busy loop</em>: không có gì quay vòng bận rộn.</li>
  <li><em class="en">not a moment before</em>: không sớm hơn một khoảnh khắc nào.</li>
  <li><em class="en">steps aside politely</em>: lịch sự nhường chỗ.</li>
  <li><em class="en">easy to accidentally undo it</em>: dễ vô tình làm mất tác dụng của nó.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson17/Lesson17.java</code>. Có 4 bài: bọc một lời gọi chặn thành <code>CompletableFuture</code> trả về ngay,
chạy tuần tự, chạy đồng thời (khởi động hết rồi mới chờ, kết quả giữ thứ tự), và ước tính thời gian thực của hai cách.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-17"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-17 --live"</code>: 5 câu hỏi độc lập được hỏi tuần tự rồi đồng thời,
in thời gian thực của mỗi cách và thời gian từng lời gọi, để bạn thấy đồng thời gần bằng lời gọi chậm nhất thay vì bằng tổng.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Vấn đề async/await giải quyết khi gọi Claude trong vòng lặp là gì?', options: ['Câu trả lời sai định dạng', 'Ngồi không chờ mạng', 'Rate limit quá thấp', 'Token quá đắt'], answer: 1, explain: '"Each request waits on the network and if your code blocks on each it sits doing nothing while the response travels. Async and await fix that."' },
    { q: 'Với 50 lời gọi chặn, chúng chạy thế nào?', options: ['Cùng lúc trên 50 nhân CPU', 'Theo nhóm 10', 'Lần lượt từng cái', 'Ngẫu nhiên'], answer: 2, explain: '"If you have 50 to make they run strictly one after another."' },
    { q: 'Coroutine là gì?', options: ['Hàm dừng được rồi chạy tiếp', 'Một thread riêng của hệ điều hành', 'Một tiến trình con', 'Một lời gọi HTTP'], answer: 0, explain: '"That\'s a function you write with async and it can pause part way through, hand control back, and resume later right where it stopped."' },
    { q: 'Event loop làm gì?', options: ['Tính toán song song trên nhiều nhân', 'Lặp lại request bị lỗi', 'Lưu cache câu trả lời', 'Điều phối các coroutine'], answer: 3, explain: '"Think of it as a scheduler. It runs your coroutines and the instant one of them is waiting on the network it advances another that\'s ready to go."' },
    { q: 'await làm gì?', options: ['Chặn cả thread cho tới khi xong', 'Tạm dừng, không chặn thread', 'Tạo một thread mới', 'Hủy request đang chạy'], answer: 1, explain: '"That\'s the keyword that actually suspends a coroutine until the thing it\'s waiting on is ready and crucially it does that without blocking the whole thread."' },
    { q: 'Vì sao lời gọi Claude "rất hợp" với async?', options: ['Vì nó tốn nhiều CPU', 'Vì nó cần nhiều RAM', 'Vì nó là I/O bound', 'Vì SDK chỉ có bản async'], answer: 2, explain: '"A request to the API is IO bound which means it spends almost all of its time waiting on the network not burning CPU on your machine."' },
    { q: 'Async lấy lại thời gian chờ bằng cách nào?', options: ['Trao quãng chờ cho việc khác', 'Tạo thêm nhiều thread', 'Nén dữ liệu gửi đi', 'Giảm max_tokens'], answer: 0, explain: '"Async hands it to other work instead and it does that without spinning up extra threads."' },
    { q: 'Khi nào lợi ích của async lớn nhất?', options: ['Khi chỉ có một lời gọi', 'Khi việc tốn nhiều CPU', 'Khi máy có nhiều nhân', 'Khi có nhiều lời gọi đang bay cùng lúc'], answer: 3, explain: '"So the more calls you have in flight the more of that idle time you reclaim and the bigger the payoff."' },
    { q: 'Ngay khi gặp await, điều gì xảy ra với coroutine?', options: ['Bị hủy', 'Tạm dừng, trả về loop', 'Chạy lại từ đầu', 'Chạy song song trên thread khác'], answer: 1, explain: '"You write await in front of a Claude call and right there your coroutine pauses. Control returns to the event loop."' },
    { q: 'Coroutine đang chờ response "tốn" gì?', options: ['Một nhân CPU', 'Một thread đầy đủ', 'Gần như không tốn gì', 'Một kết nối mạng mỗi giây'], answer: 2, explain: '"Your paused coroutine sits there costing nothing waiting for its response."' },
    { q: 'Khi response về tới, chuyện gì xảy ra?', options: ['Chạy tiếp ngay sau await', 'Coroutine chạy lại từ đầu hàm', 'Phải gọi lại API', 'Kết quả bị bỏ nếu loop đang bận'], answer: 0, explain: '"The instant the result lands the loop wakes your coroutine back up and it resumes right after the await with the result in hand."' },
    { q: 'Câu nào ĐÚNG về cơ chế chờ của async?', options: ['Nó liên tục hỏi "xong chưa"', 'Nó quay vòng bận rộn', 'Nó ngủ cố định 1 giây rồi kiểm tra', 'Loop đánh thức đúng lúc'], answer: 3, explain: '"Nothing is spinning in a busy loop and nothing is polling to check if it\'s done. The loop wakes you when it\'s time not a moment before."' },
    { q: '"Async là chạy song song." Câu này thế nào?', options: ['Đúng, mỗi task một nhân', 'Sai, nó chỉ xen kẽ', 'Đúng, nếu có nhiều await', 'Đúng với Python, sai với JavaScript'], answer: 1, explain: '"The first is that async means parallel. It doesn\'t. On a single thread async interleaves your tasks... only one is ever actually running at a given instant."' },
    { q: '"Await là chỗ code bị chặn." Câu này thế nào?', options: ['Đúng hoàn toàn', 'Đúng, nếu dùng với API', 'Sai, await là chỗ nhường', 'Đúng, khi không có mạng'], answer: 2, explain: '"The await point is precisely where your code yields... So await isn\'t the thing that blocks you. It\'s the thing that lets you not block."' },
    { q: 'Một hàm async không có điểm await nào thì sao?', options: ['Loop không chuyển được', 'Chạy nhanh hơn', 'Tự chạy song song', 'Bị báo lỗi biên dịch'], answer: 0, explain: '"A function with no awaits in it never gives the loop a chance to switch."' },
    { q: 'Gọi phiên bản async của hàm client, ngay lập tức bạn nhận được gì?', options: ['Response hoàn chỉnh', 'Một lỗi nếu mạng chậm', 'Chuỗi text đầu tiên', 'Một coroutine'], answer: 3, explain: '"Instead of the finished response you immediately get back a coroutine. A promise of work to be done."' },
    { q: 'Concurrency là gì?', options: ['Các task chạy cùng lúc trên nhiều nhân', 'Nhiều task dở dang, thay phiên', 'Một tên khác của batch', 'Gửi request qua nhiều API key'], answer: 1, explain: '"Concurrency is about structure. It means you\'ve arranged your work so many tasks are in progress at once taking turns even if only one thread is doing the work."' },
    { q: 'Parallelism đòi hỏi gì?', options: ['Một event loop', 'Từ khóa await', 'Nhiều nhân hoặc nhiều máy chạy cùng lúc', 'Chỉ một thread'], answer: 2, explain: '"Parallelism is stronger. It means tasks literally execute at the same instant which requires multiple cores or machines."' },
    { q: 'Câu nào mô tả đúng async?', options: ['Một cách để có concurrency trên một thread', 'Một cách để có parallelism trên nhiều nhân', 'Một tên gọi khác của multithreading', 'Một tính năng chỉ có trong Batches API'], answer: 0, explain: '"Async is one specific way to get concurrency... So async gives you concurrency but not necessarily parallelism."' },
    { q: 'Trong coroutine, bạn gọi một thư viện HTTP kiểu chặn (không nhường). Hậu quả?', options: ['Không sao, chỉ chậm task đó', 'Thư viện tự chuyển sang async', 'Request bị hủy', 'Cả loop đứng theo'], answer: 3, explain: '"The first is calling a blocking library from inside a coroutine. If that call doesn\'t yield it stalls the entire event loop and every other task freezes along with it."' },
    { q: 'Gọi hàm async nhưng quên await. Điều gì xảy ra (theo bài học)?', options: ['Báo lỗi ngay', 'Lặng lẽ không chạy', 'Việc chạy hai lần', 'Việc chạy chặn như thường'], answer: 1, explain: '"If you call an async function but never await the coroutine it returns that work just quietly never runs. No error, no result."' },
    { q: 'Vì sao tính toán CPU nặng trên event loop là cái bẫy?', options: ['Vì tốn token', 'Vì làm hỏng JSON', 'Loop không chuyển được', 'Vì API sẽ báo 429'], answer: 2, explain: '"A long computation with no awaits blocks everything because the loop can\'t switch away mid-calculation."' },
    { q: 'Chủ đề chung của ba cái bẫy là gì?', options: ['Giữ loop rảnh để chờ mạng', 'Luôn dùng thêm thread', 'Không bao giờ dùng await', 'Chuyển hết sang batch'], answer: 0, explain: '"Keep the event loop free to do the one thing it\'s great at, waiting on the network."' },
    { q: 'Ba lời gọi mất 300ms, 500ms, 700ms. Chạy tuần tự thì tổng thời gian thực khoảng bao nhiêu?', options: ['300ms', '700ms', '500ms', '1.500ms'], answer: 3, explain: 'Tuần tự thì "they run strictly one after another": 300 + 500 + 700 = 1.500ms.' },
    { q: 'Cùng ba lời gọi đó chạy đồng thời (cùng bay) thì khoảng bao nhiêu?', options: ['1.500ms', '700ms', '300ms', '2.100ms'], answer: 1, explain: 'Khi các quãng chờ chồng lên nhau, tổng thời gian thực gần bằng lời gọi chậm nhất: khoảng 700ms.' },
    { q: 'Đoạn code nào là cách đồng thời ĐÚNG?', options: ['Gọi và chờ từng cái trong vòng lặp', 'Gọi một cái, chờ, rồi gọi cái tiếp', 'Khởi động tất cả lời gọi trước, rồi mới chờ cả nhóm', 'Chỉ khởi động mà không bao giờ chờ'], answer: 2, explain: 'Muốn chồng các quãng chờ thì phải để mọi request cùng "in flight" rồi mới chờ; chờ từng cái ngay khi gọi lại thành tuần tự.' },
    { q: 'Trong Java, cái gì đóng vai "lời hứa về việc sẽ làm" giống coroutine?', options: ['CompletableFuture', 'String', 'ArrayList', 'Thread.sleep'], answer: 0, explain: 'CompletableFuture được trả về ngay và hoàn thành sau, tương tự coroutine; join() là chỗ chờ kết quả.' },
    { q: 'Câu tổng kết đúng của bài là gì?', options: ['Async làm model trả lời nhanh hơn', 'Async biến mọi việc thành song song', 'Async chỉ dùng cho batch', 'Concurrency, không phải parallelism'], answer: 3, explain: '"Async lets a network-bound app issue a Claude call and keep working instead of freezing on it... async buys you concurrency on one thread not true parallelism."' },
    { q: 'Một lời gọi chậm trong code chặn ảnh hưởng thế nào tới các việc phía sau?', options: ['Không ảnh hưởng', 'Làm đông cứng mọi thứ phía sau', 'Chỉ chậm việc ngay sau nó', 'Làm các việc sau chạy song song'], answer: 1, explain: '"That\'s fine for one request but one slow call freezes everything behind it."' },
    { q: 'Câu nào ĐÚNG về thời gian của một request API?', options: ['Phần lớn là code của bạn chuẩn bị request', 'Phần lớn là CPU của bạn xử lý JSON', 'Phần lớn là chờ byte quay về', 'Chia đều giữa chuẩn bị và chờ'], answer: 2, explain: '"A tiny sliver is your code preparing the request then a long stretch of just waiting for bytes to come back over the wire."' },
  ],
};
