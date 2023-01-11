package top.nsss.common.dto;

import lombok.Data;

@Data
public class RefreshTokenDto {
    LoginDto loginInfo;
    String refreshToken;
}
