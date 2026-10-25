# Java App: bài tập thực hành

Thư mục `java-app/` chứa bài tập code cho từng bài học. Chỉ cần JDK 21 trở lên, không cần Maven hay Gradle.

## Cấu trúc

Mỗi bài học có một package riêng trong `java-app/src/`:

- `lessonXX/LessonXXApi.java`: đề bài, mô tả từng phương thức cần viết.
- `lessonXX/LessonXX.java`: **chỗ bạn làm bài**. Mỗi phương thức đang ném `UnsupportedOperationException("TODO ...")`; xóa dòng đó và viết code.
- `lessonXX/LessonXXSolution.java`: lời giải mẫu. Tự làm trước rồi mới xem.
- `lessonXX/Check.java`: bộ chấm tự động cho bài đó.
- `common/Checker.java`: phần chấm dùng chung, `Main.java`: chạy bộ chấm.

Bài 03 (Quick Check-In) không có nội dung chuyên môn nên không có bài tập.

## Chạy bộ chấm

Đứng trong thư mục `java-app`.

macOS / Linux / Git Bash:

```bash
javac -encoding UTF-8 -d out $(find src -name "*.java")
java -Dstdout.encoding=UTF-8 -cp out Main          # chấm tất cả các bài
java -Dstdout.encoding=UTF-8 -cp out Main 01       # chỉ chấm bài 01
java -Dstdout.encoding=UTF-8 -cp out Main 01 --solution   # chấm lời giải mẫu để đối chiếu
```

Windows PowerShell:

```powershell
chcp 65001
javac -encoding UTF-8 -d out (Get-ChildItem -Recurse src -Filter *.java).FullName
java -Dstdout.encoding=UTF-8 -cp out Main 01
```

IntelliJ IDEA: mở thư mục `java-app`, đánh dấu `src` là Sources Root, rồi chạy `Main` (thêm `01` vào Program arguments để chấm riêng một bài).

Ý nghĩa kết quả: ✅ đạt, ❌ sai (kèm giá trị mong đợi và giá trị nhận được), ⏳ chưa làm.

## Thêm bài mới

1. Tạo package `lessonXX` với bốn file như trên.
2. Thêm một dòng `LESSONS.put("XX", lessonXX.Check::run);` vào `Main.java`.
