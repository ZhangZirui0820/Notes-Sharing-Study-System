package top.nsss.service;

import top.nsss.common.R;
import top.nsss.common.dto.LoginDto;

public interface UserService {
    R createUser(LoginDto registerInfo);

    R excuteLogin(LoginDto loginInfo);
}
