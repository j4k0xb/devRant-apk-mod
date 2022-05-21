package org.appcelerator.kroll.util;

import java.nio.charset.StandardCharsets;

public class KrollAssetHelper {
    // Placeholder for the `Lorg/appcelerator/kroll/util/KrollAssetHelper;->readAssetBytes(Ljava/lang/String;)[B` method
    public static byte[] readAssetBytesOriginal(String str) {
        return null;
    }

    public static byte[] readAssetBytes(String path) {
        byte[] bytes = readAssetBytesOriginal(path);
        if (bytes != null && path.equals("Resources/ui/common/RantListWindow.js")) {
            String source = new String(bytes, StandardCharsets.UTF_8);
            source = source.replace("result.dpp", "true");
            bytes = source.getBytes(StandardCharsets.UTF_8);
        }
        return bytes;
    }
}
