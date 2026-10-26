window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Gọi một lời gọi không chặn mới là một nửa câu chuyện. Khi cần 50 kết quả, bạn phải quản lý <strong>concurrency</strong>:
chạy nhiều lời gọi cùng lúc nhưng <strong>có trần</strong> (semaphore), đọc <strong>stream</strong>, tôn trọng <strong>rate limit</strong> bằng backpressure và backoff có jitter,
và <strong>cô lập lỗi</strong> để một nhánh hỏng không kéo đổ cả nhóm.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Fan out:</strong> phát nhiều request độc lập cùng lúc.</li>
  <li><strong>Gather:</strong> khởi động nhiều coroutine cùng lúc, chờ tất cả xong, trả về cả bộ kết quả.</li>
  <li><strong>Semaphore:</strong> một bộ đếm có trần, giới hạn số request được chạy cùng lúc; request vượt trần phải chờ tới lượt.</li>
  <li><strong>Bounded parallelism:</strong> chạy đồng thời nhưng chỉ tới một số nhất định (ví dụ 5 hay 10) mỗi lúc.</li>
  <li><strong>Jitter:</strong> một lượng ngẫu nhiên cộng vào thời gian chờ, để các request lỗi không thử lại cùng một lúc.</li>
</ul>

<h3>Phần thưởng: tổng thời gian ≈ lời gọi chậm nhất</h3>
<p>50 lời gọi độc lập chạy lần lượt thì tổng thời gian là <strong>tổng của cả 50</strong>. Chạy đồng thời: khởi động hết để tất cả cùng bay,
rồi chờ cả nhóm và gom kết quả. Tổng thời gian khi đó tiến dần tới <strong>lời gọi chậm nhất</strong>, không phải tổng. Đó là thứ bạn "mua".
Cái khó là làm vậy mà <strong>không đè bẹp API</strong>.</p>

<h3>Ba công cụ khi fan out</h3>
<ul>
  <li><strong>Gather:</strong> khởi động mọi coroutine cùng lúc, chờ tất cả, trả cả bộ kết quả.</li>
  <li><strong>Semaphore:</strong> bộ đếm có trần, giới hạn số request chạy cùng lúc.</li>
  <li><strong>Bounded parallelism:</strong> mục tiêu mà hai công cụ trên phục vụ: chạy đồng thời, nhưng chỉ chừng đó cái mỗi lúc.</li>
</ul>

<h3>Lỗi ai cũng mắc đầu tiên: fan out không giới hạn</h3>
<div class="box">🚪 <strong>Hình dung thế này:</strong> Một nhà hàng có 10 bàn. Mở cửa cho cả 500 người ùa vào cùng lúc thì hỗn loạn và nhiều người bị đuổi ra.
Đặt người đứng cửa, chỉ cho vào khi có bàn trống: ai cũng được phục vụ, êm hơn nhiều. Người đứng cửa chính là <strong>semaphore</strong>.</div>
<ul>
  <li><strong>Không giới hạn:</strong> phát cả 50 hay 5.000 request một lúc. Code đơn giản nhất, ổn với vài lời gọi, nhưng đẩy mạnh là vượt rate limit ngay;
  API trả về hàng loạt <strong>429</strong>, và bạn phải xử lý một làn sóng lỗi do chính mình gây ra.</li>
  <li><strong>Có giới hạn:</strong> bọc lời gọi trong một semaphore giữ chỉ khoảng 10 cái đang bay. Thêm chút code, nhưng ổn định hơn hẳn khi có tải thật.</li>
</ul>
<p>Quy tắc: <strong>không bao giờ fan out không giới hạn vào một API có rate limit</strong>.</p>

<h3>Đọc stream</h3>
<p>Khi bật streaming, lời gọi trả về một <strong>async iterator</strong>; bạn lặp qua nó (<code>async for</code>). Mỗi vòng là một sự kiện nhỏ;
chữ đến dưới dạng <strong>delta</strong>, những mảnh nhỏ mà bạn <strong>nối theo đúng thứ tự</strong> cho tới khi content block báo xong.
Lý do là trải nghiệm: người dùng thấy chữ hiện gần như ngay và tiếp tục chảy ra. <strong>Cùng tổng thời gian, nhưng cảm giác nhanh hơn nhiều.</strong></p>

<h3>Backpressure: khi thứ gì đó đẩy ngược lại</h3>
<ul>
  <li>API có rate limit theo số request và số token mỗi phút; vượt là <strong>429 too many requests</strong>.</li>
  <li><strong>Backpressure</strong>: để <strong>khâu chậm nhất</strong> trong pipeline đặt nhịp, để bạn không bao giờ nạp việc mới nhanh hơn tốc độ kết quả chảy ra.</li>
  <li>Công cụ thực tế: semaphore, giữ số request đang bay cố định và giữ việc mới lại cho tới khi có chỗ trống.</li>
  <li>Khi một 429 vẫn lọt qua: <strong>đừng thử lại ngay</strong> (làm tệ hơn); chờ và backoff tăng dần rồi mới thử.</li>
</ul>

<h3>Retry khi chạy đồng thời</h3>
<ul>
  <li>Ở quy mô lớn, lỗi tạm thời là bình thường. Quy tắc tạm thời/vĩnh viễn vẫn giữ nguyên; cái mới là <strong>lên lịch</strong> retry.</li>
  <li><strong>Exponential backoff:</strong> chờ một chút sau lần lỗi đầu, lâu hơn sau lần hai, lâu hơn nữa sau lần ba.</li>
  <li><strong>Cộng jitter ngẫu nhiên</strong> vào mỗi lần chờ, để cả loạt request lỗi không thử lại <strong>cùng nhịp</strong> rồi lại "giẫm đạp" API.</li>
  <li>Chỉ retry lỗi <strong>tự hết được</strong>: một lỗi vĩnh viễn được retry trên 50 nhánh song song là đốt ngân sách nhanh gấp 50 lần.</li>
</ul>

<h3>Đừng nhầm: async concurrency không phải Batches API</h3>
<ul>
  <li><strong>Async concurrency:</strong> phát nhiều lời gọi realtime cùng lúc. Mỗi cái <strong>đủ giá</strong>, đều tính vào rate limit, nhưng có câu trả lời trong vài giây.
  Dùng khi có người hay hệ thống đang chờ.</li>
  <li><strong>Batches API:</strong> gửi một job bất đồng bộ, <strong>nửa giá</strong>, phần lớn xong trong một giờ, trần 24 giờ. Dùng cho việc lớn không ai chờ.</li>
</ul>
<p>Câu hỏi thật chỉ là: <strong>có ai đang chờ không?</strong> Trả lời được là lựa chọn tự hiện ra.</p>

<h3>Cô lập lỗi: một nhánh hỏng thì hỏng một mình</h3>
<p>Fan out 50 lời gọi, phải quyết định chuyện gì xảy ra nếu một cái lỗi. Sai: để một exception <strong>xé toạc cả nhóm</strong>, vứt 49 kết quả tốt vì một cái hỏng.
Đúng: gom kết quả sao cho mỗi nhánh có <strong>kết cục riêng</strong> (trả kết quả hoặc ném lỗi). Khi cả nhóm về, đi qua từng kết cục:
giữ cái thành công, xử lý hoặc retry riêng cái lỗi. Một lời gọi chập chờn, một timeout, một lần bị bộ lọc chặn không làm chìm cả lô.
Ở quy mô lớn, <strong>luôn có nhánh nào đó lỗi</strong>; hãy đảm bảo nó lỗi một mình.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Đồng thời: tổng thời gian ≈ lời gọi chậm nhất; nhưng luôn có trần (semaphore), không fan out không giới hạn.</li>
  <li>Gặp 429 thì backoff tăng dần có jitter; chỉ retry lỗi tự hết; cô lập lỗi từng nhánh.</li>
  <li>Nhiều lời gọi realtime cùng lúc không phải Batches API: có người chờ thì realtime, không ai chờ thì batch.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">is only half the story</em>: mới là một nửa câu chuyện.</li>
  <li><em class="en">the limits that push back when you go too fast</em>: những giới hạn đẩy ngược lại khi bạn đi quá nhanh.</li>
  <li><em class="en">fanning out requests</em>: phát tỏa request ra nhiều nhánh.</li>
  <li><em class="en">trends toward your single slowest call</em>: tiến dần tới lời gọi chậm nhất.</li>
  <li><em class="en">waits its turn until a slot opens</em>: chờ tới lượt khi có chỗ trống.</li>
  <li><em class="en">without flooding the API</em>: không làm ngập API.</li>
  <li><em class="en">blow past your rate limit</em>: vượt vèo qua rate limit.</li>
  <li><em class="en">a wave of failures you created yourself</em>: một làn sóng lỗi do chính bạn gây ra.</li>
  <li><em class="en">in perfect lockstep</em>: đều răm rắp cùng nhịp.</li>
  <li><em class="en">stampede the API</em>: giẫm đạp ồ ạt lên API.</li>
  <li><em class="en">tear down the whole group</em>: xé toạc cả nhóm.</li>
  <li><em class="en">make sure it fails alone</em>: đảm bảo nó lỗi một mình.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson18/Lesson18.java</code>. Có 4 bài: gather có trần bằng <code>Semaphore</code> (không bao giờ quá N task cùng lúc,
kết quả giữ thứ tự), gather cô lập lỗi (mỗi nhánh một kết cục), backoff tăng dần có trần và jitter, và nối các delta của stream.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-18"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-18 --live"</code>: 8 lời gọi thật được fan out với trần 3 cùng lúc (in đỉnh đồng thời đo được),
một nhánh gọi model không tồn tại để thấy các nhánh khác vẫn giữ kết quả, và một câu trả lời stream được nối từ các delta.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: '50 lời gọi độc lập chạy đồng thời. Tổng thời gian tiến dần tới đâu?', options: ['Tổng thời gian của cả 50', 'Lời gọi chậm nhất', 'Lời gọi nhanh nhất', 'Trung bình của 50 lời gọi'], answer: 1, explain: '"Now your total time trends toward your single slowest call, not the sum of all of them."' },
    { q: 'Gather làm gì?', options: ['Giới hạn số request cùng lúc', 'Thử lại request lỗi', 'Chạy hết, chờ hết, gom kết quả', 'Chia request thành batch'], answer: 2, explain: '"First, gather. That\'s a call that takes many coroutines, starts them all together, and waits until everyone has finished, handing you back the whole set of results."' },
    { q: 'Semaphore là gì?', options: ['Một bộ đếm có trần', 'Một loại cache', 'Một hàng đợi kết quả', 'Một mã lỗi HTTP'], answer: 0, explain: '"It\'s just a counter with a cap. It limits how many requests are allowed to run at once."' },
    { q: 'Request vượt trần của semaphore thì sao?', options: ['Bị hủy', 'Bị gửi sang batch', 'Bị trả về lỗi 429', 'Chờ tới lượt'], answer: 3, explain: '"Any request beyond the cap waits its turn until a slot opens."' },
    { q: 'Bounded parallelism nghĩa là gì?', options: ['Chạy tuần tự từng cái', 'Đồng thời có trần', 'Chạy không giới hạn', 'Chạy trên nhiều máy'], answer: 1, explain: '"You run concurrently, but only so many at a time, say five or 10, instead of launching everything at once."' },
    { q: 'Fan out không giới hạn 5.000 request vào API có rate limit. Kết quả?', options: ['Nhanh hơn mọi cách khác', 'API tự xếp hàng giúp bạn', 'Hàng loạt lỗi 429', 'Được giảm giá như batch'], answer: 2, explain: '"Push it, and you instantly blow past your rate limit. The API starts rejecting requests with 429 errors, and now you\'re handling a wave of failures you created yourself."' },
    { q: 'Cách sửa fan out không giới hạn là gì?', options: ['Bọc lời gọi trong semaphore', 'Tăng max_tokens', 'Đổi API key', 'Dùng temperature thấp'], answer: 0, explain: '"The fix is bounded fan out. You wrap your calls in a semaphore that keeps only, say, 10 in flight at any moment."' },
    { q: 'Quy tắc ngón tay cái về fan out là gì?', options: ['Luôn fan out tối đa', 'Chỉ fan out vào ban đêm', 'Fan out theo số nhân CPU', 'Luôn đặt trần'], answer: 3, explain: '"The rule of thumb is simple. Never fan out unbounded against a rate-limited API."' },
    { q: 'Khi streaming, lời gọi trả về gì?', options: ['Một chuỗi hoàn chỉnh', 'Một async iterator', 'Một file', 'Một batch id'], answer: 1, explain: '"When you set streaming on, you don\'t wait for the whole response. Instead, the call gives you an async iterator, and you loop over it with async for."' },
    { q: 'Các delta text khi streaming cần được xử lý thế nào?', options: ['Đọc mỗi delta như một câu trả lời riêng', 'Chỉ giữ delta cuối', 'Nối theo thứ tự', 'Sắp xếp theo độ dài'], answer: 2, explain: '"The text of the answer arrives as deltas, tiny fragments, and your job is to append them in order as they come."' },
    { q: 'Streaming thay đổi điều gì?', options: ['Cảm giác nhanh hơn', 'Tổng thời gian giảm một nửa', 'Chi phí giảm', 'Câu trả lời chính xác hơn'], answer: 0, explain: '"The person sees words appear almost immediately... Same total time, but it feels far faster."' },
    { q: 'Backpressure là nguyên tắc gì?', options: ['Gửi càng nhanh càng tốt', 'Gửi lại ngay mọi request lỗi', 'Bỏ qua rate limit', 'Để khâu chậm nhất đặt nhịp'], answer: 3, explain: '"You let the slowest stage in your pipeline set the pace, so you\'re never submitting new work faster than results are draining out."' },
    { q: 'Một lỗi 429 vẫn lọt qua. Làm gì?', options: ['Thử lại ngay lập tức', 'Backoff rồi thử lại', 'Bỏ request đó', 'Tăng số request cùng lúc'], answer: 1, explain: '"When a 429 does slip through, you don\'t just retry instantly and make it worse. You wait and you back off exponentially before trying again."' },
    { q: 'Vì sao cộng jitter ngẫu nhiên vào thời gian chờ?', options: ['Để tiết kiệm token', 'Để chờ ngắn hơn', 'Để không thử lại cùng lúc', 'Để vượt rate limit'], answer: 2, explain: '"You add random jitter to each wait, so that a whole batch of failed requests doesn\'t retry in perfect lockstep and stampede the API again."' },
    { q: 'Retry một lỗi vĩnh viễn trên 50 nhánh song song thì sao?', options: ['Đốt tiền gấp 50', 'Lỗi tự hết sau vài lần', 'Không tốn gì', 'API tự sửa request'], answer: 0, explain: '"Only retry the errors that can clear, because a permanent failure retried across 50 parallel branches burns budget 50 times faster."' },
    { q: 'Exponential backoff có nghĩa là gì?', options: ['Chờ cố định 1 giây mỗi lần', 'Thử lại ngay rồi dừng', 'Chờ ngẫu nhiên không có quy luật', 'Chờ lâu dần lên'], answer: 3, explain: '"Waiting a little after the first failure, longer after the second, longer still after the third."' },
    { q: 'Nhiều lời gọi realtime cùng lúc có giá thế nào?', options: ['Nửa giá như batch', 'Đủ giá, tính vào rate limit', 'Miễn phí lời gọi thứ hai trở đi', 'Rẻ hơn 10%'], answer: 1, explain: '"Async concurrency means firing off many real-time calls at once. Everyone runs at full price, and they all count against your rate limit."' },
    { q: 'Khi nào dùng async concurrency thay vì Batches API?', options: ['Khi muốn nửa giá', 'Khi job lớn chạy qua đêm', 'Khi có người đang chờ', 'Khi không cần kết quả'], answer: 2, explain: '"That\'s what you reach for when a user or a downstream system is waiting."' },
    { q: 'Batches API khác async concurrency thế nào?', options: ['Job nền, nửa giá', 'Nhanh hơn và đắt hơn', 'Stream được', 'Chạy trên máy của bạn'], answer: 0, explain: '"The batch\'s API is the opposite trade. You submit one asynchronous job, it runs at half price, and most batches finish within the hour, with 24 hours as the ceiling."' },
    { q: 'Câu hỏi quyết định giữa concurrency và batch là gì?', options: ['Có bao nhiêu request?', 'Model nào?', 'Có dùng tool không?', 'Có ai đang chờ không?'], answer: 3, explain: '"So the real question is simply whether someone is waiting. Answer that, and the choice makes itself."' },
    { q: 'Fan out 50 lời gọi, 1 cái lỗi. Cách xử lý SAI là gì?', options: ['Giữ 49 kết quả, retry cái lỗi', 'Để một lỗi làm đổ cả nhóm', 'Ghi log cái lỗi, trả 49 cái tốt', 'Đánh dấu cái lỗi để xử lý sau'], answer: 1, explain: '"The wrong answer is letting a single exception tear down the whole group, throwing away 49 good results because one went bad."' },
    { q: 'Mẫu cô lập lỗi đúng là gì?', options: ['Bắt lỗi rồi bỏ qua', 'Chạy lại cả nhóm khi có lỗi', 'Mỗi nhánh một kết cục riêng', 'Chỉ chạy một nhánh mỗi lần'], answer: 2, explain: '"Gather results in a way that captures each branch\'s outcome independently... keep the successes, and handle or retry just the failures."' },
    { q: 'Câu chốt về lỗi ở quy mô lớn là gì?', options: ['Để nó lỗi một mình', 'Lỗi hiếm khi xảy ra', 'Một lỗi nên dừng cả hệ thống', 'Lỗi chỉ xảy ra khi không có semaphore'], answer: 0, explain: '"Designed for the fact that at scale, some branch always fails, and make sure it fails alone."' },
    { q: 'Rate limit giới hạn những gì?', options: ['Chỉ độ dài câu trả lời', 'Số model dùng được', 'Số người dùng của app', 'Số request và số token mỗi phút'], answer: 3, explain: '"The API enforces rate limits, caps on requests, and tokens per minute. Cross one and you get a 429, too many requests."' },
    { q: 'Semaphore giúp backpressure thế nào?', options: ['Tăng rate limit', 'Giữ cố định số đang bay', 'Giảm giá token', 'Tự retry mọi lỗi'], answer: 1, explain: '"Capping in-flight requests to a fixed number and holding new work until a slot frees up."' },
    { q: 'Trần 3, mỗi lời gọi mất khoảng 1 giây, có 9 lời gọi. Thời gian thực khoảng bao nhiêu?', options: ['1 giây', '9 giây', '3 giây', '0,3 giây'], answer: 2, explain: 'Mỗi lúc chỉ 3 cái cùng bay: 9 lời gọi chia thành 3 đợt, mỗi đợt khoảng 1 giây, tổng khoảng 3 giây.' },
    { q: 'Theo bài học, điều gì quan trọng hơn tên các công cụ?', options: ['Kỷ luật có trần, cô lập lỗi', 'Dùng đúng thư viện mới nhất', 'Viết code ngắn nhất', 'Dùng nhiều thread nhất có thể'], answer: 0, explain: '"The name matters less than the discipline behind them. Keep concurrency bounded and isolate failures."' },
    { q: 'Với vài lời gọi, fan out không giới hạn có sao không?', options: ['Luôn gây 429', 'Bị API cấm', 'Tốn gấp đôi', 'Ổn'], answer: 3, explain: '"It\'s the simplest code you could write, and for a handful of calls it\'s totally fine, but push it, and you instantly blow past your rate limit."' },
    { q: 'Bốn công cụ của concurrency trong phần tổng kết là gì?', options: ['Batch, cache, tool, thinking', 'Gather, semaphore, streaming, backoff', 'Model, prompt, schema, config', 'Thread, process, fork, join'], answer: 1, explain: '"Gather, semaphores, streaming, and backoff, each with its own job."' },
    { q: 'Điều cần nhớ cuối bài là gì?', options: ['Async concurrency rẻ hơn batch', 'Batch nhanh hơn concurrency', 'Realtime song song khác batch', 'Streaming chỉ dùng trong batch'], answer: 2, explain: '"One thing to watch, many real-time calls is not the same as the batch\'s API."' },
  ],
};
