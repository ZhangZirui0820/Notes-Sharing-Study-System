<template>
  <div>
    <div class="currentGroup">
      <span v-if="currentGroup">current group: {{ currentGroup }}</span>
    </div>
    <div class="group-menu">
      <el-button round class="create-group" @click="createGroup"
        >Create a Group</el-button
      >
      <el-button
        type="primary"
        round
        class="join-group"
        @click="handleJoinGroup"
        >Join a Group</el-button
      >
      <el-dropdown trigger="click">
        <el-button round class="dropdown-btn">
          Your Group<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu
          slot="dropdown"
          class="menu-item"
          v-if="addedGroup.length !== 0"
        >
          <el-dropdown-item
            v-for="item in addedGroup"
            :key="item.id"
            @click.native="choiceGroup(item)"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
        <el-dropdown-menu v-else class="menu-item">
          <el-dropdown-item disabled> empty </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="primary"
        class="post-note-in-group"
        @click="postGroupNote"
        >Post Notes in Group</el-button
      >

      <el-drawer
        title="Join a Group"
        :visible.sync="drawer"
        direction="ltr"
        class="group-drawer"
      >
        <div class="groups" v-if="groups.length !== 0">
          <div class="group" v-for="item in groups" :key="item.id">
            <div class="group-name">{{ item.name }}</div>
            <div class="add-group">
              <el-button type="primary" size="small" @click="joinGroup(item.id)"
                >join group</el-button
              >
            </div>
          </div>
        </div>
        <div class="groups" v-else>empty</div>
      </el-drawer>

      <el-dialog
        title="Create a Group"
        :visible.sync="dialogVisible"
        width="30%"
        @close="handleDialogClose"
      >
        <div class="create-group-form">
          <span class="label">Group Name</span>
          <el-input type="text" v-model="addGroupName"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddGroup">Cancel</el-button>
          <el-button type="primary" @click="confirmAddGroup">Create</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addGroup,
  selectAllOrganize,
  selectOrganizeByUserId,
  addOrganizeUser,
  selectOrganizeById
} from '@/network/group'

import { getUserId } from '@/utils/userUtil'

export default {
  data() {
    return {
      drawer: false,
      dialogVisible: false,
      addGroupName: '',
      groups: [],
      addedGroup: [],
      currentGroup: ''
    }
  },
  mounted() {
    this.getAllowAddGroups()
    this.getCurrentGroup()
  },
  methods: {
    handleJoinGroup() {
      this.drawer = true
    },
    createGroup() {
      this.dialogVisible = true
    },
    cancelAddGroup() {
      this.dialogVisible = false
    },
    handleDialogClose() {
      this.addGroupName = ''
    },
    confirmAddGroup() {
      if (this.addGroupName.trim().length === 0) {
        this.$message.warning('group name cannot be empty')
        return
      }
      addGroup({
        name: this.addGroupName,
        userId: getUserId()
      }).then(() => {
        this.dialogVisible = false
        this.$message.success('create group success')

        // reload
        this.getAddedGroup()
      })
    },

    // ?????????????????????????????????group
    async getAllowAddGroups() {
      // ??????group
      const { data: allOrganize } = await selectAllOrganize()

      // ??????????????????????????????group
      const addedList = await this.getAddedGroup()

      // ?????????????????????, ??????group???0, ???????????????????????????
      if (addedList.length === 0 || allOrganize.length === 0) {
        this.groups = allOrganize
        return
      }

      for (const { id } of addedList) {
        const findIndex = allOrganize.findIndex((item) => item.id == id)
        allOrganize.splice(findIndex, 1)
      }

      this.groups = allOrganize
    },

    // ??????????????????????????????group
    async getAddedGroup() {
      // ??????????????????????????????group
      const { data: addedList } = await selectOrganizeByUserId(getUserId())
      this.addedGroup = addedList

      return addedList
    },

    // ????????????group
    joinGroup(id) {
      addOrganizeUser({ id, userId: getUserId() }).then(() => {
        this.drawer = false
        this.$message.success('success')

        // reload
        this.getAllowAddGroups()
      })
    },

    choiceGroup(groupInfo) {
      this.$router.push({
        path: `/group?id=${groupInfo.id}&page=1`
      })

      // data update
      this.getCurrentGroup()
      // ??????group-body??????group????????????????????????????????????
      this.$bus.$emit('updated-body')
    },

    getCurrentGroup() {
      const id = this.$route.query.id
      if (!id) return

      selectOrganizeById(id).then((res) => {
        this.currentGroup = res.data.name
        this.$bus.$emit('getCurrentGroupName', res.data.name)
      })
    },
    postGroupNote() {
      const id = this.$route.query.id
      if (!id) {
        this.$message.warning('Please select group first')
        return
      }

      this.$router.push(`/submit-note?groupId=${id}`)
    }
  }
}
</script>

<style lang="less">
.currentGroup {
  font-size: 18px;
  padding: 15px 0;
  height: 18px;
  font-weight: bold;
}
.group-menu {
  display: flex;
  padding: 10px 50px;
  align-items: center;
  justify-content: space-between;

  .create-group {
    width: 180px;
    height: 45px;
  }

  .join-group {
    width: 300px;
    height: 45px;
  }

  .dropdown-btn {
    width: 300px;
    height: 45px;
  }

  .post-note-in-group {
    width: 300px;
    height: 45px;
  }
}

.group-drawer {
  .groups {
    padding: 0px 20px;
    .group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      margin-bottom: 10px;
    }
  }
}

.create-group-form {
  display: flex;
  align-items: center;
  & > .label {
    display: block;
    margin-right: 20px;
    width: 140px;
    font-size: 16px;
  }
}

.menu-item li {
  width: 270px !important;
}
</style>
