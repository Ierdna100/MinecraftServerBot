export class FileUtils {
    public static formatDirName(filename: string): string {
        if (filename.charAt(filename.length - 1) == "/" || filename.charAt(filename.length - 1) == "\\") {
            return filename.substring(0, filename.length - 1);
        }

        return filename;
    }
}
