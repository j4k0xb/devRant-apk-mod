.class public Lorg/appcelerator/kroll/util/KrollAssetHelper;
.super Ljava/lang/Object;
.source "KrollAssetHelper.java"


# direct methods
.method public constructor <init>()V
    .registers 1

    .prologue
    .line 5
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static readAssetBytes(Ljava/lang/String;)[B
    .registers 5
    .param p0, "path"    # Ljava/lang/String;

    .prologue
    .line 12
    invoke-static {p0}, Lorg/appcelerator/kroll/util/KrollAssetHelper;->readAssetBytesOriginal(Ljava/lang/String;)[B

    move-result-object v0

    .line 13
    .local v0, "bytes":[B
    if-eqz v0, :cond_23

    const-string v2, "Resources/ui/common/RantListWindow.js"

    invoke-virtual {p0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_23

    .line 14
    new-instance v1, Ljava/lang/String;

    sget-object v2, Ljava/nio/charset/StandardCharsets;->UTF_8:Ljava/nio/charset/Charset;

    invoke-direct {v1, v0, v2}, Ljava/lang/String;-><init>([BLjava/nio/charset/Charset;)V

    .line 15
    .local v1, "source":Ljava/lang/String;
    const-string v2, "result.dpp"

    const-string v3, "true"

    invoke-virtual {v1, v2, v3}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    move-result-object v1

    .line 16
    sget-object v2, Ljava/nio/charset/StandardCharsets;->UTF_8:Ljava/nio/charset/Charset;

    invoke-virtual {v1, v2}, Ljava/lang/String;->getBytes(Ljava/nio/charset/Charset;)[B

    move-result-object v0

    .line 18
    .end local v1    # "source":Ljava/lang/String;
    :cond_23
    return-object v0
.end method

.method public static readAssetBytesOriginal(Ljava/lang/String;)[B
    .registers 2
    .param p0, "str"    # Ljava/lang/String;

    .prologue
    .line 8
    const/4 v0, 0x0

    return-object v0
.end method
